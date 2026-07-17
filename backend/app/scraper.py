import re
import time
import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Optional

BASE_URL = "https://dps.psx.com.pk"
SCRAPE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

# Simple cache for prices (3 minutes cache TTL)
price_cache: Dict[str, Dict] = {}
CACHE_TTL_SECONDS = 180

def fetch_page(url: str, method: str = "GET", data: Optional[str] = None, headers: Optional[dict] = None) -> str:
    try:
        final_headers = {**SCRAPE_HEADERS}
        if headers:
            final_headers.update(headers)
        
        if method == "POST":
            res = requests.post(url, data=data, headers=final_headers, timeout=12)
        else:
            res = requests.get(url, headers=final_headers, timeout=12)
        
        res.raise_for_status()
        return res.text
    except Exception as e:
        raise Exception(f"Failed to reach {url}: {str(e)}")

def parse_num(text: Optional[str]) -> Optional[float]:
    if not text:
        return None
    cleaned = text.strip().replace("Rs.", "").replace(",", "").replace("%", "").replace("(", "").replace(")", "").strip()
    try:
        return float(cleaned)
    except ValueError:
        return None

def parse_day_range(text: str) -> Dict[str, Optional[float]]:
    m = re.search(r"DAY RANGE([\d.,]+)\s*[–—-]\s*([\d.,]+)", text)
    if not m:
        return {"day_low": None, "day_high": None}
    return {"day_low": parse_num(m.group(1)), "day_high": parse_num(m.group(2))}

def scrape_price(symbol: str) -> dict:
    symbol = symbol.strip().upper()
    url = f"{BASE_URL}/company/{symbol}"
    html = fetch_page(url)

    def extract(pattern: str) -> Optional[str]:
        m = re.search(pattern, html)
        return m.group(1).strip() if m else None

    current_raw = extract(r'class="quote__close"[^>]*>\s*([^<]+)</div>')
    change_raw = extract(r'class="change__value"[^>]*>\s*([^<]+)</div>')
    pct_raw = extract(r'class="change__percent"[^>]*>\s*([^<]+)</div>')
    name = extract(r'class="quote__name"[^>]*>\s*([^<]+)</div>')
    sector = extract(r'class="quote__sector"[^>]*>\s*<span>([^<]+)</span>')
    as_of = extract(r'class="quote__date"[^>]*>\s*([^<]+)</div>')
    range_raw = extract(r'class="stats company__quote__rangeStats"[^>]*>\s*([^<]{10,})</div>')
    
    day_low, day_high = None, None
    if range_raw:
        ranges = parse_day_range(range_raw)
        day_low, day_high = ranges["day_low"], ranges["day_high"]

    current_price = parse_num(current_raw)
    if current_price is None:
        raise Exception(f"Could not parse price for '{symbol}'. Check: {url}")

    return {
        "symbol": symbol,
        "name": name,
        "sector": sector,
        "current_price": current_price,
        "change": parse_num(change_raw),
        "change_percent": parse_num(pct_raw),
        "day_low": day_low,
        "day_high": day_high,
        "as_of": re.sub(r"^\^\s*", "", as_of) if as_of else None,
        "url": url,
    }

def get_cached_or_scraped_price(ticker: str) -> dict:
    symbol = ticker.strip().upper()
    now = time.time()
    cached = price_cache.get(symbol)
    if cached and (now - cached["timestamp"] < CACHE_TTL_SECONDS):
        return cached["data"]

    data = scrape_price(symbol)
    price_cache[symbol] = {
        "timestamp": now,
        "data": data
    }
    return data

def parse_table_rows(html: str, tbody_pattern: str) -> List[List[str]]:
    tbody_match = re.search(tbody_pattern, html)
    if not tbody_match:
        return []
    
    rows = []
    row_regex = re.compile(r"<tr>([\s\S]*?)</tr>")
    cell_regex = re.compile(r"<t[hd][^>]*>([\s\S]*?)</t[hd]>")
    
    for row_match in row_regex.finditer(tbody_match.group(1)):
        cells = []
        for cell_match in cell_regex.finditer(row_match.group(1)):
            text = re.sub(r"<[^>]+>", "", cell_match.group(1))
            text = text.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&nbsp;", " ").strip()
            cells.append(text)
        if cells:
            rows.append(cells)
    return rows

def scrape_detail(symbol: str) -> dict:
    symbol = symbol.strip().upper()
    url = f"{BASE_URL}/company/{symbol}"
    html = fetch_page(url)

    # Description
    desc_match = re.search(r"BUSINESS DESCRIPTION</div><p>([\s\S]*?)</p>", html)
    description = re.sub(r"<[^>]+>", "", desc_match.group(1)).replace("&amp;", "&").strip() if desc_match else None

    # Address
    address_match = re.search(r"ADDRESS</div><p>([\s\S]*?)</p>", html)
    address = re.sub(r"<[^>]+>", "", address_match.group(1)).replace("&amp;", "&").strip() if address_match else None

    # Website
    web_match = re.search(r'WEBSITE</div><p>\s*<a href="([^"]+)"', html)
    website = web_match.group(1) if web_match else None

    # Registrar
    registrar_match = re.search(r"REGISTRAR</div><p>([\s\S]*?)</p>", html)
    registrar = re.sub(r"<[^>]+>", "", registrar_match.group(1)).replace("&amp;", "&").strip() if registrar_match else None

    # Auditor
    auditor_match = re.search(r"AUDITOR</div><p>([\s\S]*?)</p>", html)
    auditor = re.sub(r"<[^>]+>", "", auditor_match.group(1)).replace("&amp;", "&").strip() if auditor_match else None

    # Fiscal Year End
    fiscal_year_match = re.search(r"Fiscal Year End</div><p>([\s\S]*?)</p>", html)
    fiscal_year_end = re.sub(r"<[^>]+>", "", fiscal_year_match.group(1)).strip() if fiscal_year_match else None

    # Key People
    key_people = []
    key_people_match = re.search(r"KEY PEOPLE</div><table[^>]*>([\s\S]*?)</table>", html)
    if key_people_match:
        row_re = re.compile(r"<tr>([\s\S]*?)</tr>")
        for m in row_re.finditer(key_people_match.group(1)):
            name_m = re.search(r"<strong>([\s\S]*?)</strong>", m.group(1))
            role_m = re.search(r"</td><td>([\s\S]*?)</td>", m.group(1))
            if name_m and role_m:
                key_people.append({
                    "name": re.sub(r"<[^>]+>", "", name_m.group(1)).strip(),
                    "role": re.sub(r"<[^>]+>", "", role_m.group(1)).strip()
                })

    # Equity Section
    equity_section = re.search(r'id="equity"([\s\S]*?)id="announcements"', html)
    equity = {
        "market_cap_thousands": None,
        "shares": None,
        "free_float_shares": None,
        "free_float_pct": None
    }
    if equity_section:
        stat_items = re.findall(r'<div class="stats_item">([\s\S]*?)</div>\s*</div>', equity_section.group(1))
        for item in stat_items:
            label_m = re.search(r'stats_label">([\s\S]*?)</div>', item)
            value_m = re.search(r'stats_value">([\s\S]*?)</div>', item)
            if label_m and value_m:
                label = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", label_m.group(1))).strip()
                value = re.sub(r"<[^>]+>", "", value_m.group(1)).strip()
                if "Market Cap" in label:
                    equity["market_cap_thousands"] = parse_num(value)
                elif label == "Shares":
                    equity["shares"] = parse_num(value)
                elif label == "Free Float" and "%" in value:
                    equity["free_float_pct"] = parse_num(value)
                elif label == "Free Float":
                    equity["free_float_shares"] = parse_num(value)

    # Financials
    financials = {"annual": [], "quarterly": []}
    financials_section = re.search(r'id="financials"([\s\S]*?)id="ratios"', html)
    if financials_section:
        fs_html = financials_section.group(1)
        # Annual
        annual_panel = re.search(r'data-name="Annual">([\s\S]*?)</div>\s*</div>\s*</div>', fs_html)
        if annual_panel:
            years = [m.group(1) for m in re.finditer(r'<th class="right">(\d+)</th>', annual_panel.group(1))]
            rows = parse_table_rows(annual_panel.group(1), r"<tbody[^>]*>([\s\S]*?)</tbody>")
            annual_map = {y: {"year": y} for y in years}
            for cells in rows:
                if len(cells) > 0:
                    metric = cells[0]
                    for idx, yr in enumerate(years):
                        if idx + 1 < len(cells):
                            val = parse_num(cells[idx + 1])
                            if metric == "Sales":
                                annual_map[yr]["sales"] = val
                            elif metric == "Profit after Taxation":
                                annual_map[yr]["profit_after_tax"] = val
                            elif metric == "EPS":
                                annual_map[yr]["eps"] = val
            financials["annual"] = list(annual_map.values())

        # Quarterly
        quarterly_panel = re.search(r'data-name="Quarterly">([\s\S]*?)</div>\s*</div>\s*</div>', fs_html)
        if quarterly_panel:
            quarters = [m.group(1).strip() for m in re.finditer(r'<th class="right">([^<]+)</th>', quarterly_panel.group(1))]
            rows = parse_table_rows(quarterly_panel.group(1), r"<tbody[^>]*>([\s\S]*?)</tbody>")
            q_map = {q: {"period": q} for q in quarters}
            for cells in rows:
                if len(cells) > 0:
                    metric = cells[0]
                    for idx, q in enumerate(quarters):
                        if idx + 1 < len(cells):
                            val = parse_num(cells[idx + 1])
                            if metric == "Sales":
                                q_map[q]["sales"] = val
                            elif metric == "Profit after Taxation":
                                q_map[q]["profit_after_tax"] = val
                            elif metric == "EPS":
                                q_map[q]["eps"] = val
            financials["quarterly"] = list(q_map.values())

    # Ratios
    ratios = {"years": [], "data": []}
    ratios_section = re.search(r'id="ratios"([\s\S]*?)id="payouts"', html)
    if ratios_section:
        years = [m.group(1) for m in re.finditer(r'<th class="right">(\d+)</th>', ratios_section.group(1))]
        ratios["years"] = years
        rows = parse_table_rows(ratios_section.group(1), r"<tbody[^>]*>([\s\S]*?)</tbody>")
        for cells in rows:
            if len(cells) > 0:
                entry = {"metric": cells[0]}
                for idx, yr in enumerate(years):
                    if idx + 1 < len(cells):
                        entry[yr] = parse_num(cells[idx + 1])
                ratios["data"].append(entry)

    # Quote Stats
    ldcp_match = re.search(r'LDCP</div><div class="stats_value">([\d.,]+)</div>', html)
    open_match = re.search(r'Open</div><div class="stats_value">([\d.,]+)</div>', html)
    high_match = re.search(r'High</div><div class="stats_value">([\d.,]+)</div>', html)
    low_match = re.search(r'Low</div><div class="stats_value">([\d.,]+)</div>', html)
    volume_match = re.search(r'Volume</div><div class="stats_value">([\d.,]+)</div>', html)
    pe_match = re.search(r'P/E Ratio[^<]*</div><div class="stats_value">([\d.,]+)</div>', html)
    range52_match = re.search(r'52-WEEK RANGE[^<]*</div><div class="stats_value">([\d.,\s–—-]+)<', html)

    week52_low, week52_high = None, None
    if range52_match:
        parts = re.split(r"\s*[–—-]\s*", range52_match.group(1))
        if len(parts) >= 2:
            week52_low = parse_num(parts[0])
            week52_high = parse_num(parts[1])

    quote_stats = {
        "open": parse_num(open_match.group(1)) if open_match else None,
        "high": parse_num(high_match.group(1)) if high_match else None,
        "low": parse_num(low_match.group(1)) if low_match else None,
        "volume": parse_num(volume_match.group(1)) if volume_match else None,
        "ldcp": parse_num(ldcp_match.group(1)) if ldcp_match else None,
        "pe_ratio_ttm": parse_num(pe_match.group(1)) if pe_match else None,
        "week52_low": week52_low,
        "week52_high": week52_high,
    }

    return {
        "symbol": symbol,
        "url": url,
        "profile": {
            "description": description,
            "address": address,
            "website": website,
            "registrar": registrar,
            "auditor": auditor,
            "fiscal_year_end": fiscal_year_end,
            "key_people": key_people,
        },
        "equity": equity,
        "quote_stats": quote_stats,
        "financials": financials,
        "ratios": ratios,
    }

def scrape_payouts(symbol: str) -> dict:
    symbol = symbol.strip().upper()
    url = f"{BASE_URL}/payouts"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
        "Referer": url,
    }
    body = f"symbol={symbol}"
    html = fetch_page(url, method="POST", data=body, headers=headers)

    payouts = []
    row_regex = re.compile(r"<tr>([\s\S]*?)</tr>")
    cell_regex = re.compile(r"<td[^>]*>([\s\S]*?)</td>")
    
    for row_match in row_regex.finditer(html):
        cells = []
        for cell_match in cell_regex.finditer(row_match.group(1)):
            text = re.sub(r"<[^>]+>", "", cell_match.group(1))
            text = text.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&nbsp;", " ").strip()
            cells.append(text)
        if len(cells) >= 5:
            payouts.append({
                "symbol": cells[0] if cells[0] else symbol,
                "company": cells[1] if cells[1] else None,
                "sector": cells[2] if cells[2] else None,
                "dividend_announcement": cells[3] if cells[3] else None,
                "announcement_date": cells[4] if cells[4] else None,
                "book_closure_date": cells[5] if len(cells) > 5 else None,
            })

    total_match = re.search(r"Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)\s+entries", html)
    total = int(total_match.group(1)) if total_match else len(payouts)

    return {"symbol": symbol, "total": total, "payouts": payouts}

def scrape_announcements(symbol: str) -> dict:
    symbol = symbol.strip().upper()
    url = f"{BASE_URL}/company/{symbol}"
    html = fetch_page(url)

    section_match = re.search(r'id="announcements"([\s\S]*?)id="financials"', html)
    if not section_match:
        return {"symbol": symbol, "url": url, "categories": [], "total": 0, "announcements": []}

    section_html = section_match.group(1)
    all_announcements = []
    found_categories = []
    VALID_CATEGORIES = ["Financial Results", "Board Meetings", "Others"]

    panel_split_re = re.compile(r'data-name="([^"]+)">([\s\S]*?)(?=data-name="|$)')
    for pm in panel_split_re.finditer(section_html):
        cat = pm.group(1)
        panel_html = pm.group(2)

        if cat not in VALID_CATEGORIES:
            continue

        tbody_match = re.search(r"<tbody[^>]*>([\s\S]*?)</tbody>", panel_html)
        if not tbody_match:
            continue

        rows = []
        row_re = re.compile(r"<tr>([\s\S]*?)</tr>")
        cell_re = re.compile(r"<td[^>]*>([\s\S]*?)</td>")
        
        for rm in row_re.finditer(tbody_match.group(1)):
            cell_texts = []
            for cm in cell_re.finditer(rm.group(1)):
                text = re.sub(r"<[^>]+>", "", cm.group(1))
                text = text.replace("&amp;", "&").replace("&nbsp;", " ").strip()
                cell_texts.append(text)
            
            if len(cell_texts) < 2:
                continue

            date = cell_texts[0] if cell_texts[0] else None
            title = cell_texts[1] if cell_texts[1] else None
            documents = []

            doc_match = re.search(r'href="/download/document/(\d+)\.pdf"', rm.group(1))
            if doc_match:
                doc_id = doc_match.group(1)
                documents.append({
                    "type": "document",
                    "id": doc_id,
                    "download_url": f"http://localhost:3001/api/psx/download/document/{doc_id}",
                    "source_url": f"{BASE_URL}/download/document/{doc_id}.pdf",
                    "filename": f"{doc_id}.pdf",
                })

            att_match = re.search(r'href="/download/attachment/([\w.-]+\.pdf)"', rm.group(1))
            if att_match:
                att_id = att_match.group(1)
                documents.append({
                    "type": "attachment",
                    "id": att_id,
                    "download_url": f"http://localhost:3001/api/psx/download/attachment/{att_id}",
                    "source_url": f"{BASE_URL}/download/attachment/{att_id}",
                    "filename": att_id,
                })

            rows.append({"date": date, "title": title, "category": cat, "documents": documents})

        if rows:
            found_categories.append(cat)
            all_announcements.extend(rows)

    return {
        "symbol": symbol,
        "url": url,
        "categories": found_categories,
        "total": len(all_announcements),
        "announcements": all_announcements,
    }

def parse_rss(xml_text: str) -> List[dict]:
    items = []
    item_regex = re.compile(r"<item>([\s\S]*?)</item>")
    
    for match in item_regex.finditer(xml_text):
        block = match.group(1)
        
        def get(tag: str) -> str:
            m = re.search(r"<" + tag + r"[^>]*>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*</" + tag + r">|<" + tag + r"[^>]*>([\s\S]*?)</" + tag + r">", block, re.IGNORECASE)
            if m:
                return (m.group(1) or m.group(2) or "").strip()
            return ""

        title = get("title")
        link_match = re.search(r"<link[^>]*>([\s\S]*?)</link>", block, re.IGNORECASE)
        link = link_match.group(1).strip() if link_match else ""
        if not link:
            link_m = re.search(r"<link\s*/>|<link>([\s\S]*?)<", block)
            link = link_m.group(1).strip() if link_m else ""
            
        description = get("description")
        description = re.sub(r"<[^>]+>", "", description).replace("&nbsp;", " ").replace("&amp;", "&").strip()
        pub_date = get("pubDate") or get("dc:date")
        category = get("category")

        if title:
            items.append({
                "title": title,
                "link": link,
                "description": description[:300],
                "category": category,
                "publishedAt": pub_date,
            })
    return items

def scrape_news() -> List[dict]:
    feeds = [
        "https://tribune.com.pk/feed/business",
        "https://tribune.com.pk/feed/latest"
    ]
    all_items = []
    for url in feeds:
        try:
            xml = fetch_page(url, headers={"Accept": "application/rss+xml, application/xml, text/xml, */*"})
            items = parse_rss(xml)
            all_items.extend(items)
        except Exception as e:
            print(f"[News Feed Error] {url}: {str(e)}")
            
    # Deduplicate items by link
    seen = set()
    deduped = []
    for item in all_items:
        if item["link"] not in seen:
            seen.add(item["link"])
            deduped.append(item)
            
    return deduped
