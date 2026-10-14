/**
 * PSX API Client
 * 
 * Communicates with the local/cloud FastAPI server at http://localhost:3001
 * to fetch live PSX stock data, news, company details, portfolio holdings,
 * watchlists, user profiles, and chat logs.
 */

const API_BASE = 'https://finzyx-ai-powered-advisor-analyst.onrender.com';

// ── Types ────────────────────────────────────────────────────────────────────

export interface LivePrice {
  symbol: string;
  name: string | null;
  sector: string | null;
  current_price: number;
  change: number | null;
  change_percent: number | null;
  day_low: number | null;
  day_high: number | null;
  as_of: string | null;
  url: string;
  error?: string;
}

export interface StockDetailData {
  symbol: string;
  url: string;
  profile: {
    description: string | null;
    address: string | null;
    website: string | null;
    registrar: string | null;
    auditor: string | null;
    fiscal_year_end: string | null;
    key_people: Array<{ name: string; role: string }>;
  };
  equity: {
    market_cap_thousands: number | null;
    shares: number | null;
    free_float_shares: number | null;
    free_float_pct: number | null;
  };
  quote_stats: {
    open: number | null;
    high: number | null;
    low: number | null;
    volume: number | null;
    ldcp: number | null;
    pe_ratio_ttm: number | null;
    week52_low: number | null;
    week52_high: number | null;
  };
  financials: {
    annual: Array<{ year: string; sales?: number | null; profit_after_tax?: number | null; eps?: number | null }>;
    quarterly: Array<{ period: string; sales?: number | null; profit_after_tax?: number | null; eps?: number | null }>;
  };
  ratios: {
    years: string[];
    data: Array<Record<string, string | number | null>>;
  };
}

export interface PayoutEntry {
  symbol: string;
  company: string | null;
  sector: string | null;
  dividend_announcement: string | null;
  announcement_date: string | null;
  book_closure_date: string | null;
}

export interface PayoutsData {
  symbol: string;
  total: number;
  payouts: PayoutEntry[];
}

export interface NewsItem {
  title: string;
  link: string;
  description: string;
  category: string;
  publishedAt: string;
}

export interface NewsResponse {
  items: NewsItem[];
  total: number;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  dummy_balance: number;
  phone?: string;
  photo_url?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export interface InvestorProfileData {
  age: string;
  income: string;
  risk_appetite: string;
  completed: boolean;
}

export interface ApiHolding {
  id?: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
}

export interface ChatLogEntry {
  id?: string;
  query: string;
  response: string;
  language: string;
  createdAt?: string;
}

// ── Auth Token Management ────────────────────────────────────────────────────

export function getAuthToken(): string | null {
  return localStorage.getItem('finzyx_token');
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('finzyx_token', token);
  } else {
    localStorage.removeItem('finzyx_token');
  }
}

export function clearAuthToken(): void {
  localStorage.removeItem('finzyx_token');
}

// ── Helper ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string, 
  options: RequestInit = {}, 
  timeoutMs = 15000
): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    
    // Attach auth header if token exists
    const token = getAuthToken();
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Network error or timeout — backend is likely offline
    return null;
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch the live price for a single symbol.
 */
export async function fetchLivePrice(symbol: string): Promise<LivePrice | null> {
  return apiFetch<LivePrice>(`/api/psx?symbol=${encodeURIComponent(symbol.toUpperCase())}`);
}

/**
 * Fetch live prices for multiple symbols in a single batch (max 20).
 */
export async function fetchLivePrices(symbols: string[]): Promise<LivePrice[]> {
  if (symbols.length === 0) return [];
  const csv = symbols.map(s => s.toUpperCase()).join(',');
  const data = await apiFetch<LivePrice[]>(`/api/psx?symbols=${encodeURIComponent(csv)}`);
  return data ?? [];
}

/**
 * Fetch full company detail (profile, equity, financials, ratios, quote stats).
 */
export async function fetchStockDetail(symbol: string): Promise<StockDetailData | null> {
  return apiFetch<StockDetailData>(`/api/psx/detail?symbol=${encodeURIComponent(symbol.toUpperCase())}`);
}

/**
 * Fetch dividend / payout history.
 */
export async function fetchPayouts(symbol: string): Promise<PayoutsData | null> {
  return apiFetch<PayoutsData>(`/api/psx/payouts?symbol=${encodeURIComponent(symbol.toUpperCase())}`);
}

/**
 * Fetch live Tribune market news.
 */
export async function fetchMarketNews(): Promise<NewsResponse | null> {
  return apiFetch<NewsResponse>('/api/news');
}

/**
 * Quick health check — returns true if the backend is reachable.
 */
export async function isBackendOnline(): Promise<boolean> {
  const result = await apiFetch<{ status: string }>('/api/health', {}, 3000);
  return result?.status === 'ok';
}

// ── Auth Endpoints ────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string): Promise<AuthResponse | null> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  
  const res = await apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password })
  });
  return res;
}

export async function signupUser(name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      // Pydantic validation errors (422) come as an array of details
      if (res.status === 422 && Array.isArray(data.detail)) {
        return { success: false, message: data.detail[0]?.msg || 'Invalid input format' };
      }
      return { success: false, message: data.detail || 'Signup failed' };
    }
    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, message: 'Network error or backend offline' };
  }
}

export async function verifySignupUser(email: string, code: string): Promise<{ success: boolean; data?: AuthResponse; message?: string }> {
  try {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const res = await fetch(`${API_BASE}/api/auth/verify-signup`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.detail || 'Verification failed' };
    }
    return { success: true, data: data as AuthResponse };
  } catch (err) {
    return { success: false, message: 'Network error or backend offline' };
  }
}

export async function requestPasswordReset(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.detail || 'Failed to process request' };
    }
    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, message: 'Network error or backend offline' };
  }
}

export async function submitPasswordReset(email: string, code: string, new_password: string): Promise<{ message: string } | null> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  return apiFetch<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, code, new_password })
  });
}


export async function fetchMe(): Promise<UserResponse | null> {
  return apiFetch<UserResponse>('/api/auth/me');
}

export async function fetchProfile(): Promise<InvestorProfileData | null> {
  return apiFetch<InvestorProfileData>('/api/auth/profile');
}

export async function updateUserApi(updates: { name?: string; phone?: string }): Promise<UserResponse | null> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  return apiFetch<UserResponse>('/api/auth/user', {
    method: 'PUT',
    headers,
    body: JSON.stringify(updates)
  });
}

export async function uploadPhotoApi(photoBase64: string): Promise<{ photo_url: string } | null> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  return apiFetch<{ photo_url: string }>('/api/auth/upload-photo', {
    method: 'POST',
    headers,
    body: JSON.stringify({ photo: photoBase64 })
  });
}

export async function updateProfile(age: string, income: string, risk_appetite: string): Promise<boolean> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  
  const res = await apiFetch<{ message: string }>('/api/auth/profile', {
    method: 'POST',
    headers,
    body: JSON.stringify({ age, income, risk_appetite })
  });
  return res !== null;
}

// ── Portfolio & Watchlist Endpoints ──────────────────────────────────────────

export async function fetchHoldings(): Promise<ApiHolding[] | null> {
  return apiFetch<ApiHolding[]>('/api/portfolio/holdings');
}

export async function executeTradeApi(
  symbol: string,
  quantity: number,
  buyPrice: number,
  action: 'buy' | 'sell'
): Promise<{ dummy_balance: number; holdings: ApiHolding[] } | null> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  
  return apiFetch<{ dummy_balance: number; holdings: ApiHolding[] }>('/api/portfolio/trade', {
    method: 'POST',
    headers,
    body: JSON.stringify({ symbol, quantity, buy_price: buyPrice, action })
  });
}

export async function fetchWatchlist(): Promise<string[] | null> {
  return apiFetch<string[]>('/api/watchlist');
}

export async function toggleWatchlistApi(symbol: string): Promise<string[] | null> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  
  return apiFetch<string[]>('/api/watchlist/toggle', {
    method: 'POST',
    headers,
    body: JSON.stringify({ symbol })
  });
}

// ── Chat Endpoints ────────────────────────────────────────────────────────────

export async function fetchChatLogs(): Promise<ChatLogEntry[] | null> {
  return apiFetch<ChatLogEntry[]>('/api/chat/logs');
}

export async function saveChatLog(query: string, response: string, language: string): Promise<boolean> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  
  const res = await apiFetch<{ message: string }>('/api/chat/logs', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, response, language })
  });
  return res !== null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(messages: ChatMessage[], investor_profile?: any): Promise<{ response: string } | null> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  
  return apiFetch<{ response: string }>('/api/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages, investor_profile })
  });
}

export interface RahbarChatResponse {
  answer: string;
  sources: Array<{ symbol: string; title: string }>;
  ticker_validation: {
    valid: boolean;
    unverified_tickers: string[];
  };
  grounded: boolean;
}

export async function sendRahbarQuery(query: string, language: string): Promise<RahbarChatResponse | null> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  
  return apiFetch<RahbarChatResponse>('/api/rahbar/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, language })
  });
}

// ── Roadmap Endpoints ─────────────────────────────────────────────────────────

export interface RoadmapStockPick {
  symbol: string;
  name: string;
  sector: string;
  div_yield: number;
}

export interface RoadmapExplanation {
  symbol: string;
  sector: string;
  has_detail: boolean;
  explanation: string;
  sources: Array<{ symbol: string; title: string }>;
}

export interface RoadmapResponse {
  allocation: {
    equity_pct: number;
    dividend_pct: number;
    fixed_income_pct: number;
    reasoning: string;
  };
  equity_picks: RoadmapStockPick[];
  dividend_picks: RoadmapStockPick[];
  fixed_income_note: string;
  explanation: RoadmapExplanation[];
  sources: Array<{ symbol: string; title: string }>;
  grounded: number;
}

export interface RoadmapResult {
  data: RoadmapResponse | null;
  error: string | null;
  status: number | null;
}

/**
 * Fetch the AI-generated investment roadmap.
 * Uses a 45s timeout to accommodate the ~22s backend LLM generation time.
 * Returns structured result with error info (unlike apiFetch which swallows errors).
 */
export async function fetchRoadmap(shariahOnly: boolean, language: string): Promise<RoadmapResult> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);

    const token = getAuthToken();
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(`${API_BASE}/api/rahbar/roadmap`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ shariah_only: shariahOnly, language }),
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!res.ok) {
      const body = await res.json().catch(() => ({ detail: 'Unknown error' }));
      return { data: null, error: body.detail || 'Request failed', status: res.status };
    }

    const data = (await res.json()) as RoadmapResponse;
    return { data, error: null, status: res.status };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { data: null, error: 'Request timed out — the AI analysis is taking longer than expected. Please try again.', status: null };
    }
    return { data: null, error: 'Network error or backend offline', status: null };
  }
}

// ── Smart Stock Screener (NLP-driven) ─────────────────────────────────────────

export interface ScreenerStock {
  symbol: string;
  name: string;
  sector: string;
  shariah: boolean;
  div_yield: number;
}

export interface ScreenerFilters {
  sector: string | null;
  shariah_only: boolean | null;
  sort_by: string | null;
  sort_direction: string | null;
  min_dividend_yield: number | null;
}

export interface ScreenerResponse {
  results: ScreenerStock[];
  total: number;
  filters_applied: ScreenerFilters;
  language: string;
  ai_insight: string;
  suggested_queries: string[];
}

/**
 * Search stocks using natural language via the NLP-driven screener endpoint.
 * No auth required — screener is a public discovery tool.
 * Uses a 20s timeout to accommodate the Gemini NLP parsing call.
 */
export async function searchScreener(query: string): Promise<ScreenerResponse | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(
      `${API_BASE}/api/screener/search?q=${encodeURIComponent(query)}`,
      { signal: controller.signal }
    );

    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as ScreenerResponse;
  } catch {
    return null;
  }
}

