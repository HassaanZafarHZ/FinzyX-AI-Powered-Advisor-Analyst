import os
import re
import requests
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Query, Response, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from decimal import Decimal
import datetime

from backend.app.database import engine, Base, get_db
from backend.app.models import User, Profile, Stock, Holding, Watchlist, DividendEvent, ChatLog
from backend.app.auth import hash_password, verify_password, create_access_token, get_current_user
from backend.app import scraper
from backend.app.email_service import send_password_reset_email, send_onboarding_email, send_signup_verification_email
import random
import string

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinzyX API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Supports all origins (local React & cloud deployments)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Seed stocks on startup if empty ────────────────────────────────────────────
def seed_stocks():
    db = next(get_db())
    try:
        count = db.query(Stock).count()
        if count == 0:
            print("[DB Seeding] Stocks table is empty. Seeding 50 PSX stocks...")
            stocks_to_seed = [
                # BANKING
                {"symbol": "MCB", "name": "MCB Bank Ltd", "sector": "Banking", "shariah": True, "div_yield": 8.5},
                {"symbol": "HBL", "name": "Habib Bank Ltd", "sector": "Banking", "shariah": True, "div_yield": 7.2},
                {"symbol": "UBL", "name": "United Bank Ltd", "sector": "Banking", "shariah": False, "div_yield": 9.1},
                {"symbol": "ABL", "name": "Allied Bank Ltd", "sector": "Banking", "shariah": True, "div_yield": 8.8},
                {"symbol": "BAHL", "name": "Bank AL Habib Ltd", "sector": "Banking", "shariah": True, "div_yield": 7.5},
                {"symbol": "BAFL", "name": "Bank Alfalah Ltd", "sector": "Banking", "shariah": True, "div_yield": 6.9},
                {"symbol": "MEBL", "name": "Meezan Bank Ltd", "sector": "Banking", "shariah": True, "div_yield": 6.2},
                {"symbol": "AKBL", "name": "Askari Bank Ltd", "sector": "Banking", "shariah": False, "div_yield": 5.5},
                {"symbol": "BOP", "name": "Bank of Punjab", "sector": "Banking", "shariah": False, "div_yield": 4.5},
                {"symbol": "JSBL", "name": "JS Bank Ltd", "sector": "Banking", "shariah": False, "div_yield": 3.2},
                # CEMENT
                {"symbol": "LUCK", "name": "Lucky Cement Ltd", "sector": "Cement", "shariah": True, "div_yield": 5.5},
                {"symbol": "DGKC", "name": "DG Khan Cement", "sector": "Cement", "shariah": True, "div_yield": 4.8},
                {"symbol": "MLCF", "name": "Maple Leaf Cement", "sector": "Cement", "shariah": True, "div_yield": 3.5},
                {"symbol": "CHCC", "name": "Cherat Cement", "sector": "Cement", "shariah": True, "div_yield": 6.0},
                {"symbol": "FCCL", "name": "Fauji Cement", "sector": "Cement", "shariah": True, "div_yield": 4.2},
                {"symbol": "PIOC", "name": "Pioneer Cement", "sector": "Cement", "shariah": True, "div_yield": 5.8},
                {"symbol": "KOHC", "name": "Kohat Cement", "sector": "Cement", "shariah": True, "div_yield": 7.0},
                {"symbol": "ACPL", "name": "Attock Cement", "sector": "Cement", "shariah": True, "div_yield": 5.2},
                {"symbol": "GHNL", "name": "Gharibwal Cement", "sector": "Cement", "shariah": True, "div_yield": 2.8},
                # OIL & GAS
                {"symbol": "OGDC", "name": "Oil & Gas Dev Corp", "sector": "Oil & Gas", "shariah": True, "div_yield": 12.3},
                {"symbol": "PPL", "name": "Pakistan Petroleum Ltd", "sector": "Oil & Gas", "shariah": True, "div_yield": 10.5},
                {"symbol": "POL", "name": "Pakistan Oilfields Ltd", "sector": "Oil & Gas", "shariah": True, "div_yield": 9.8},
                {"symbol": "MARI", "name": "Mari Petroleum", "sector": "Oil & Gas", "shariah": True, "div_yield": 5.2},
                {"symbol": "PSO", "name": "Pakistan State Oil", "sector": "Oil & Gas", "shariah": False, "div_yield": 6.8},
                {"symbol": "APL", "name": "Attock Petroleum Ltd", "sector": "Oil & Gas", "shariah": True, "div_yield": 8.5},
                {"symbol": "HASCOL", "name": "Hascol Petroleum", "sector": "Oil & Gas", "shariah": False, "div_yield": 0.0},
                {"symbol": "ATRL", "name": "Attock Refinery Ltd", "sector": "Oil & Gas", "shariah": True, "div_yield": 7.2},
                {"symbol": "NRL", "name": "National Refinery Ltd", "sector": "Oil & Gas", "shariah": True, "div_yield": 6.5},
                # FERTILIZER / CHEMICALS
                {"symbol": "ENGRO", "name": "Engro Corporation", "sector": "Chemicals", "shariah": True, "div_yield": 7.2},
                {"symbol": "FFC", "name": "Fauji Fertilizer Co", "sector": "Fertilizer", "shariah": True, "div_yield": 11.5},
                {"symbol": "EFERT", "name": "Engro Fertilizers", "sector": "Fertilizer", "shariah": True, "div_yield": 9.8},
                {"symbol": "FFBL", "name": "Fauji Fertilizer Bin Qasim", "sector": "Fertilizer", "shariah": True, "div_yield": 6.5},
                {"symbol": "FATIMA", "name": "Fatima Fertilizer", "sector": "Fertilizer", "shariah": True, "div_yield": 8.5},
                {"symbol": "ICI", "name": "ICI Pakistan Ltd", "sector": "Chemicals", "shariah": True, "div_yield": 4.5},
                {"symbol": "EPCL", "name": "Engro Polymer & Chem", "sector": "Chemicals", "shariah": True, "div_yield": 7.8},
                {"symbol": "LOTCHEM", "name": "Lotte Chemical Pakistan", "sector": "Chemicals", "shariah": False, "div_yield": 5.0},
                # AUTOMOBILE
                {"symbol": "SAZEW", "name": "Sazgar Engineering Works", "sector": "Automobile", "shariah": True, "div_yield": 6.8},
                {"symbol": "HCAR", "name": "Honda Atlas Cars", "sector": "Automobile", "shariah": True, "div_yield": 3.5},
                {"symbol": "INDU", "name": "Indus Motor Co", "sector": "Automobile", "shariah": True, "div_yield": 5.2},
                {"symbol": "PSMC", "name": "Pak Suzuki Motor", "sector": "Automobile", "shariah": True, "div_yield": 2.5},
                {"symbol": "MTL", "name": "Millat Tractors Ltd", "sector": "Automobile", "shariah": True, "div_yield": 8.5},
                {"symbol": "AGHA", "name": "Agha Steel Industries", "sector": "Automobile", "shariah": True, "div_yield": 4.2},
                # TECHNOLOGY
                {"symbol": "SYS", "name": "Systems Ltd", "sector": "Technology", "shariah": True, "div_yield": 3.5},
                {"symbol": "TRG", "name": "TRG Pakistan Ltd", "sector": "Technology", "shariah": True, "div_yield": 0.0},
                {"symbol": "NETSOL", "name": "NetSol Technologies", "sector": "Technology", "shariah": True, "div_yield": 2.8},
                {"symbol": "PICT", "name": "Pak Int'l Container", "sector": "Technology", "shariah": True, "div_yield": 8.5},
                # POWER / ENERGY
                {"symbol": "HUBC", "name": "Hub Power Company", "sector": "Power", "shariah": False, "div_yield": 14.5},
                {"symbol": "KAPCO", "name": "Kot Addu Power", "sector": "Power", "shariah": False, "div_yield": 15.2},
                {"symbol": "PKGP", "name": "PakGen Power Ltd", "sector": "Power", "shariah": False, "div_yield": 10.5},
                {"symbol": "KEL", "name": "K-Electric Ltd", "sector": "Power", "shariah": False, "div_yield": 0.0},
                {"symbol": "NCPL", "name": "Nishat Chunian Power", "sector": "Power", "shariah": False, "div_yield": 12.5},
                {"symbol": "SSGC", "name": "Sui Southern Gas", "sector": "Power", "shariah": False, "div_yield": 3.5},
                {"symbol": "SNGP", "name": "Sui Northern Gas", "sector": "Power", "shariah": False, "div_yield": 4.2},
                # PHARMA
                {"symbol": "GSKCH", "name": "GSK Consumer Healthcare", "sector": "Pharma", "shariah": True, "div_yield": 5.5},
                {"symbol": "SEARLE", "name": "The Searle Company", "sector": "Pharma", "shariah": True, "div_yield": 4.8},
                {"symbol": "ABOT", "name": "Abbott Laboratories Pak", "sector": "Pharma", "shariah": True, "div_yield": 3.2},
                {"symbol": "FEROZ", "name": "Ferozsons Laboratories", "sector": "Pharma", "shariah": True, "div_yield": 4.5},
                {"symbol": "HINOON", "name": "Highnoon Laboratories", "sector": "Pharma", "shariah": True, "div_yield": 3.8},
                # FOOD / OTHERS
                {"symbol": "MUREB", "name": "Murree Brewery", "sector": "Food", "shariah": False, "div_yield": 2.5},
                {"symbol": "NESTLE", "name": "Nestlé Pakistan Ltd", "sector": "Food", "shariah": True, "div_yield": 4.5},
                {"symbol": "UNITY", "name": "Unity Foods Ltd", "sector": "Food", "shariah": True, "div_yield": 5.2},
                {"symbol": "COLG", "name": "Colgate-Palmolive Pak", "sector": "Food", "shariah": True, "div_yield": 5.5},
                {"symbol": "DAWH", "name": "Dawood Hercules", "sector": "Chemicals", "shariah": True, "div_yield": 8.5},
                {"symbol": "FHAM", "name": "First Habib Modaraba", "sector": "Financial", "shariah": True, "div_yield": 9.5},
            ]
            for s in stocks_to_seed:
                db.add(Stock(**s))
            db.commit()
            print(f"[DB Seeding] Seeding completed: {len(stocks_to_seed)} stocks seeded successfully.")

        # Seed demo user if not exists
        demo_user = db.query(User).filter(User.email == "demo@finzyx.com").first()
        if not demo_user:
            print("[DB Seeding] Creating demo user...")
            demo_user = User(
                name="Ahmad Khan",
                email="demo@finzyx.com",
                hashed_password=hash_password("demo123"),
                dummy_balance=Decimal("50000.00")
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            # Initialize profile
            profile = Profile(user_id=demo_user.id, completed=False)
            db.add(profile)
            db.commit()
            print("[DB Seeding] Demo user created successfully.")
    except Exception as e:
        print(f"[DB Seeding ERROR] {str(e)}")
    finally:
        db.close()

seed_stocks()

# ── Pydantic Request/Response Schemas ──────────────────────────────────────────
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str

class VerifySignupRequest(BaseModel):
    email: EmailStr
    code: str

class ProfileUpdate(BaseModel):
    age: Optional[str] = None
    income: Optional[str] = None
    risk_appetite: Optional[str] = None

class TradeRequest(BaseModel):
    symbol: str
    quantity: float
    buy_price: float
    action: str  # "buy" or "sell"

class ToggleWatchlist(BaseModel):
    symbol: str

class ChatLogRequest(BaseModel):
    query: str
    response: str
    language: str

# ── Health Route ──────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok", "service": "psx-api"}

# ── Authentication Routes ──────────────────────────────────────────────────────
@app.post("/api/auth/signup")
def signup(payload: UserSignup, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Explicitly check deliverability (MX records)
    try:
        from email_validator import validate_email, EmailNotValidError
        validate_email(payload.email, check_deliverability=True)
    except EmailNotValidError as e:
        raise HTTPException(status_code=400, detail=f"Invalid email: {str(e)}")

    # Check if user already exists
    existing = db.query(User).filter(User.email == payload.email).first()
    
    code = ''.join(random.choices(string.digits, k=6))
    
    if existing:
        if existing.is_verified:
            raise HTTPException(status_code=400, detail="Email is already registered")
        else:
            # Resend OTP and update details
            existing.hashed_password = hash_password(payload.password)
            existing.name = payload.name
            existing.signup_code = code
            db.commit()
            background_tasks.add_task(send_signup_verification_email, existing.email, code)
            return {"message": "Verification code sent to email"}

    new_user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        dummy_balance=Decimal("50000.00"),
        is_verified=False,
        signup_code=code
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    background_tasks.add_task(send_signup_verification_email, new_user.email, code)
    return {"message": "Verification code sent to email"}

@app.post("/api/auth/verify-signup")
def verify_signup(payload: VerifySignupRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or user.is_verified:
        raise HTTPException(status_code=400, detail="Invalid request")
        
    if user.signup_code != payload.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
        
    user.is_verified = True
    user.signup_code = None
    db.commit()

    # Initialize 1:1 empty profile
    profile = Profile(user_id=user.id, completed=False)
    db.add(profile)
    db.commit()

    # Send onboarding email in background
    background_tasks.add_task(send_onboarding_email, user.email, user.name)

    token = create_access_token({"sub": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "dummy_balance": float(user.dummy_balance),
        }
    }

@app.post("/api/auth/login")
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    if getattr(user, 'is_verified', False) is False:
        raise HTTPException(status_code=403, detail="Please verify your email to log in.")

    token = create_access_token({"sub": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "dummy_balance": float(user.dummy_balance),
        }
    }

@app.post("/api/auth/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user exists with this email")
    
    # Generate 6-digit code
    code = ''.join(random.choices(string.digits, k=6))
    
    # Set expiration to 1 min from now
    expires = datetime.datetime.utcnow() + datetime.timedelta(minutes=1)
    
    user.reset_code = code
    user.reset_code_expires_at = expires
    db.commit()
    
    background_tasks.add_task(send_password_reset_email, user.email, code)
    return {"message": "If that email exists, a reset code was sent."}

@app.post("/api/auth/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or reset code")
        
    if not user.reset_code or user.reset_code != payload.code:
        raise HTTPException(status_code=400, detail="Invalid reset code")
        
    if user.reset_code_expires_at and datetime.datetime.utcnow() > user.reset_code_expires_at:
        raise HTTPException(status_code=400, detail="Reset code has expired")
        
    # Valid code, update password
    user.hashed_password = hash_password(payload.new_password)
    user.reset_code = None
    user.reset_code_expires_at = None
    db.commit()
    
    return {"message": "Password reset successfully"}

@app.get("/api/auth/me")
def me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "dummy_balance": float(user.dummy_balance),
    }

@app.get("/api/auth/profile")
def get_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(user_id=user.id, completed=False)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return {
        "age": profile.age,
        "income": profile.income,
        "risk_appetite": profile.risk_appetite,
        "completed": profile.completed,
    }

@app.post("/api/auth/profile")
def update_profile(payload: ProfileUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(user_id=user.id)
        db.add(profile)

    profile.age = payload.age
    profile.income = payload.income
    profile.risk_appetite = payload.risk_appetite
    profile.completed = True

    db.commit()
    return {"message": "Profile updated successfully"}

# ── PSX Scraper Proxy Routes ───────────────────────────────────────────────────
@app.get("/api/psx")
def get_psx(
    symbol: Optional[str] = None,
    symbols: Optional[str] = None
):
    if symbols:
        tickers = [s.strip().upper() for s in symbols.split(",") if s.strip()]
        if not tickers:
            raise HTTPException(status_code=400, detail="No symbols provided")
        if len(tickers) > 20:
            raise HTTPException(status_code=400, detail="Max 20 symbols per request")
        
        results = []
        for ticker in tickers:
            try:
                results.append(scraper.get_cached_or_scraped_price(ticker))
            except Exception as e:
                results.append({"symbol": ticker, "error": str(e)})
        return results

    if not symbol:
        raise HTTPException(status_code=400, detail="Provide ?symbol=OGDC or ?symbols=OGDC,HBL")

    try:
        return scraper.get_cached_or_scraped_price(symbol)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/api/psx/detail")
def get_psx_detail(symbol: str):
    try:
        return scraper.scrape_detail(symbol)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/api/psx/profile")
def get_psx_profile(symbol: str):
    try:
        detail = scraper.scrape_detail(symbol)
        return {"symbol": detail["symbol"], "url": f"{scraper.BASE_URL}/company/{symbol.upper()}", **detail["profile"]}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/api/psx/equity")
def get_psx_equity(symbol: str):
    try:
        detail = scraper.scrape_detail(symbol)
        return {"symbol": detail["symbol"], "url": f"{scraper.BASE_URL}/company/{symbol.upper()}", **detail["equity"]}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/api/psx/financials")
def get_psx_financials(symbol: str):
    try:
        detail = scraper.scrape_detail(symbol)
        return {
            "symbol": detail["symbol"],
            "url": f"{scraper.BASE_URL}/company/{symbol.upper()}",
            "note": "All numbers in thousands (000s) except EPS",
            **detail["financials"]
        }
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/api/psx/ratios")
def get_psx_ratios(symbol: str):
    try:
        detail = scraper.scrape_detail(symbol)
        return {"symbol": detail["symbol"], "url": f"{scraper.BASE_URL}/company/{symbol.upper()}", **detail["ratios"]}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

def parse_book_closure(bc_str):
    if not bc_str:
        return None
    first_part = bc_str.split("-")[0].strip()
    match = re.search(r"(\d{2})/(\d{2})/(\d{4})", first_part)
    if match:
        day = int(match.group(1))
        month = int(match.group(2))
        year = int(match.group(3))
        try:
            ex_date = datetime.date(year, month, day) - datetime.timedelta(days=1)
            return ex_date
        except Exception:
            return None
    return None

def parse_amount(ann_str):
    if not ann_str:
        return 0.0
    pct_match = re.search(r"(\d+(\.\d+)?)%", ann_str)
    if pct_match:
        return float(pct_match.group(1)) / 10.0
    rs_match = re.search(r"(?:Rs\.?|PKR)\s*(\d+(\.\d+)?)", ann_str, flags=re.IGNORECASE)
    if rs_match:
        return float(rs_match.group(1))
    num_match = re.search(r"(\d+(\.\d+)?)", ann_str)
    if num_match:
        return float(num_match.group(1))
    return 0.0

@app.get("/api/psx/payouts")
def get_psx_payouts(symbol: str, db: Session = Depends(get_db)):
    try:
        data = scraper.scrape_payouts(symbol)
        
        if data and "payouts" in data:
            db.query(DividendEvent).filter(DividendEvent.symbol == symbol).delete()
            for p in data["payouts"]:
                ex_date = parse_book_closure(p.get("book_closure_date"))
                amount = parse_amount(p.get("dividend_announcement"))
                if ex_date:
                    event = DividendEvent(
                        symbol=symbol,
                        amount=amount,
                        ex_date=ex_date,
                        announcement_date=p.get("announcement_date"),
                        book_closure_date=p.get("book_closure_date"),
                        status="confirmed"
                    )
                    db.add(event)
            db.commit()

        return data
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/api/psx/announcements")
def get_psx_announcements(
    symbol: str,
    category: Optional[str] = None
):
    try:
        data = scraper.scrape_announcements(symbol)
        if category:
            data["announcements"] = [a for a in data["announcements"] if a["category"] == category]
            data["total"] = len(data["announcements"])
        return data
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/api/psx/download/document/{doc_id}")
def download_document(doc_id: str):
    url = f"{scraper.BASE_URL}/download/document/{doc_id}.pdf"
    res = requests.get(url, headers={"User-Agent": scraper.SCRAPE_HEADERS["User-Agent"]}, stream=True)
    if not res.ok:
        raise HTTPException(status_code=res.status_code, detail="Failed to fetch PDF from PSX")
    
    return StreamingResponse(
        res.iter_content(chunk_size=4096),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={doc_id}.pdf"}
    )

@app.get("/api/psx/download/attachment/{att_id}")
def download_attachment(att_id: str):
    url = f"{scraper.BASE_URL}/download/attachment/{att_id}"
    res = requests.get(url, headers={"User-Agent": scraper.SCRAPE_HEADERS["User-Agent"]}, stream=True)
    if not res.ok:
        raise HTTPException(status_code=res.status_code, detail="Failed to fetch PDF attachment from PSX")
    
    return StreamingResponse(
        res.iter_content(chunk_size=4096),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={att_id}"}
    )

# ── Tribune News Route ─────────────────────────────────────────────────────────
@app.get("/api/news")
def get_news():
    try:
        items = scraper.scrape_news()
        return {"items": items, "total": len(items)}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

# ── Portfolio & Trade Routes ───────────────────────────────────────────────────
@app.get("/api/portfolio/holdings")
def get_holdings(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    holdings = db.query(Holding).filter(Holding.user_id == user.id).all()
    return [
        {
            "id": h.id,
            "symbol": h.symbol,
            "quantity": float(h.quantity),
            "buyPrice": float(h.buy_price),
        }
        for h in holdings
    ]

@app.post("/api/portfolio/trade")
def process_trade(payload: TradeRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    symbol = payload.symbol.strip().upper()
    
    # Ensure stock exists in database
    stock = db.query(Stock).filter(Stock.symbol == symbol).first()
    if not stock:
        # Auto-create stock entry if not seeded
        stock = Stock(symbol=symbol, name=symbol, sector="Other")
        db.add(stock)
        db.commit()

    total_cost = Decimal(str(payload.quantity)) * Decimal(str(payload.buy_price))

    if payload.action == "buy":
        if user.dummy_balance < total_cost:
            raise HTTPException(status_code=400, detail="Insufficient dummy balance to complete trade.")
        
        user.dummy_balance -= total_cost
        
        # Check if holding already exists
        holding = db.query(Holding).filter(Holding.user_id == user.id, Holding.symbol == symbol).first()
        if holding:
            existing_qty = Decimal(str(holding.quantity))
            existing_price = Decimal(str(holding.buy_price))
            new_qty = Decimal(str(payload.quantity))
            new_price = Decimal(str(payload.buy_price))
            
            # Recalculate average cost
            total_qty = existing_qty + new_qty
            avg_price = ((existing_qty * existing_price) + (new_qty * new_price)) / total_qty
            
            holding.quantity = total_qty
            holding.buy_price = avg_price
        else:
            holding = Holding(
                user_id=user.id,
                symbol=symbol,
                quantity=Decimal(str(payload.quantity)),
                buy_price=Decimal(str(payload.buy_price))
            )
            db.add(holding)

    elif payload.action == "sell":
        holding = db.query(Holding).filter(Holding.user_id == user.id, Holding.symbol == symbol).first()
        if not holding or Decimal(str(holding.quantity)) < Decimal(str(payload.quantity)):
            raise HTTPException(status_code=400, detail="Insufficient shares of stock in portfolio.")

        user.dummy_balance += total_cost
        
        existing_qty = Decimal(str(holding.quantity))
        sell_qty = Decimal(str(payload.quantity))
        
        if existing_qty == sell_qty:
            db.delete(holding)
        else:
            holding.quantity = existing_qty - sell_qty
            
    else:
        raise HTTPException(status_code=400, detail="Invalid action parameter. Must be 'buy' or 'sell'.")

    db.commit()
    
    # Get updated holdings
    updated_holdings = db.query(Holding).filter(Holding.user_id == user.id).all()
    return {
        "dummy_balance": float(user.dummy_balance),
        "holdings": [
            {
                "id": h.id,
                "symbol": h.symbol,
                "quantity": float(h.quantity),
                "buyPrice": float(h.buy_price),
            }
            for h in updated_holdings
        ]
    }

# ── Watchlist Routes ───────────────────────────────────────────────────────────
@app.get("/api/watchlist")
def get_watchlist(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(Watchlist).filter(Watchlist.user_id == user.id).all()
    return [item.symbol for item in items]

@app.post("/api/watchlist/toggle")
def toggle_watchlist(payload: ToggleWatchlist, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    symbol = payload.symbol.strip().upper()
    item = db.query(Watchlist).filter(Watchlist.user_id == user.id, Watchlist.symbol == symbol).first()
    
    if item:
        db.delete(item)
    else:
        # Check stock exists
        stock = db.query(Stock).filter(Stock.symbol == symbol).first()
        if not stock:
            stock = Stock(symbol=symbol, name=symbol, sector="Other")
            db.add(stock)
            db.commit()
            
        new_item = Watchlist(user_id=user.id, symbol=symbol)
        db.add(new_item)
        
    db.commit()
    
    # Get updated list
    items = db.query(Watchlist).filter(Watchlist.user_id == user.id).all()
    return [i.symbol for i in items]

# ── Chat Log Routes ────────────────────────────────────────────────────────────
@app.get("/api/chat/logs")
def get_chat_logs(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    logs = db.query(ChatLog).filter(ChatLog.user_id == user.id).order_by(ChatLog.created_at.asc()).all()
    return [
        {
            "id": log.id,
            "query": log.query,
            "response": log.response,
            "language": log.language,
            "createdAt": log.created_at.isoformat() if log.created_at else None
        }
        for log in logs
    ]

@app.post("/api/chat/logs")
def add_chat_log(payload: ChatLogRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log = ChatLog(
        user_id=user.id,
        query=payload.query,
        response=payload.response,
        language=payload.language
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return {"message": "Chat log saved successfully"}
