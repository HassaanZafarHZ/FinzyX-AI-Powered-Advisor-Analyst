import uuid
from sqlalchemy import Column, String, Boolean, Numeric, Float, Date, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    reset_code = Column(String, nullable=True)
    reset_code_expires_at = Column(DateTime, nullable=True)
    dummy_balance = Column(Numeric(15, 2), default=50000.00)
    is_verified = Column(Boolean, default=False)
    signup_code = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    holdings = relationship("Holding", back_populates="user", cascade="all, delete-orphan")
    watchlist = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    chat_logs = relationship("ChatLog", back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    age = Column(String, nullable=True)
    income = Column(String, nullable=True)
    risk_appetite = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="profile")

class Stock(Base):
    __tablename__ = "stocks"

    symbol = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sector = Column(String, nullable=False)
    shariah = Column(Boolean, default=False)
    div_yield = Column(Float, default=0.0)

    holdings = relationship("Holding", back_populates="stock", cascade="all, delete-orphan")
    watchlist = relationship("Watchlist", back_populates="stock", cascade="all, delete-orphan")
    dividend_events = relationship("DividendEvent", back_populates="stock", cascade="all, delete-orphan")

class Holding(Base):
    __tablename__ = "holdings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    symbol = Column(String, ForeignKey("stocks.symbol", ondelete="CASCADE"), nullable=False)
    quantity = Column(Numeric(12, 4), nullable=False)
    buy_price = Column(Numeric(12, 4), nullable=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="holdings")
    stock = relationship("Stock", back_populates="holdings")

class Watchlist(Base):
    __tablename__ = "watchlists"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    symbol = Column(String, ForeignKey("stocks.symbol", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="watchlist")
    stock = relationship("Stock", back_populates="watchlist")

class DividendEvent(Base):
    __tablename__ = "dividend_events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    symbol = Column(String, ForeignKey("stocks.symbol", ondelete="CASCADE"), nullable=False)
    amount = Column(Float, nullable=False)
    ex_date = Column(Date, nullable=False)
    announcement_date = Column(String, nullable=True)
    book_closure_date = Column(String, nullable=True)
    status = Column(String, default="confirmed")
    created_at = Column(DateTime, default=func.now())

    stock = relationship("Stock", back_populates="dividend_events")

class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    language = Column(String, default="english")
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="chat_logs")
