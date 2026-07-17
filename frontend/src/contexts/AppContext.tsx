import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { psxStocks } from "../data/psxStocks";
import { 
  fetchLivePrices, 
  LivePrice, 
  isBackendOnline,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  loginUser,
  signupUser,
  verifySignupUser,
  fetchMe,
  fetchProfile,
  updateProfile,
  fetchHoldings,
  executeTradeApi,
  fetchWatchlist,
  toggleWatchlistApi,
  UserResponse
} from "../services/psxApi";

export type Language = "english" | "roman-urdu";

export interface User {
  id: string;
  name: string;
  email: string;
  dummy_balance: number;
  phone?: string;
}

export interface InvestorProfile {
  age: string;
  income: string;
  riskAppetite: "conservative" | "moderate" | "aggressive" | "";
  completed: boolean;
}

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  sector: string;
}

interface AppContextType {
  currentUser: User | null;
  investorProfile: InvestorProfile | null;
  language: Language;
  profileComplete: boolean;
  holdings: Holding[];
  watchlist: string[];
  dummyBalance: number;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  verifySignup: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  updateUser: (updates: Partial<User>) => void;
  saveInvestorProfile: (profile: InvestorProfile) => Promise<void>;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  executeTrade: (type: "buy" | "sell", symbol: string, quantity: number, price: number) => Promise<{ success: boolean; message: string }>;
  toggleWatchlist: (symbol: string) => Promise<void>;
  livePrices: Record<string, LivePrice>;
  refreshLivePrices: () => Promise<void>;
  backendOnline: boolean;
  isInitializing: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  english: {
    welcome: "Welcome back",
    dashboard: "Dashboard",
    screener: "Stock Screener",
    aiRahbar: "AI Rahbar",
    portfolio: "Portfolio",
    dividends: "Dividends",
    subscription: "Subscription",
    profile: "Profile",
    logout: "Logout",
    search: "Search",
    searchPlaceholder: "Try: low risk cement stocks, high dividend banking sector",
    completeProfile: "Complete Your Profile",
    completeProfileDesc: "Set up your investor profile to get a personalized investment roadmap.",
    startSetup: "Start Setup",
    yourRoadmap: "Your AI Investment Roadmap",
    roadmapDesc: "Generated based on your risk profile",
    welcomeMsg: "Here's your investment overview and personalized insights.",
    totalPortfolio: "Total Portfolio Value",
    todayChange: "Today's Change",
    totalInvested: "Total Invested",
    totalGain: "Total Gain/Loss",
    watchlist: "Watchlist",
    language: "Language",
    english: "English",
    romanUrdu: "Roman Urdu",
    signIn: "Sign In",
    signUp: "Sign Up",
    createAccount: "Create Account",
    forgotPassword: "Forgot password?",
    emailSent: "Password reset link has been sent to your email.",
    stockScreener: "Smart Stock Screener",
    screenerDesc: "Search stocks using natural language",
    results: "Search Results",
    stocksFound: "stocks found",
    sector: "Sector",
    price: "Price",
    change: "Change",
    divYield: "Div Yield",
    aiInsight: "AI Insight",
    personalDetails: "Personal Details",
    investorProfile: "Investor Profile",
    saveChanges: "Save Changes",
    updateProfile: "Update Profile",
    profileCompletion: "Profile Status",
    myProfile: "My Profile",
    age: "Age",
    monthlyIncome: "Monthly Income (PKR)",
    riskAppetite: "Risk Appetite",
    conservative: "Conservative",
    moderate: "Moderate",
    aggressive: "Aggressive",
  },
  "roman-urdu": {
    welcome: "Khush Amdeed",
    dashboard: "Dashboard",
    screener: "Stock Screener",
    aiRahbar: "AI Rahbar",
    portfolio: "Portfolio",
    dividends: "Dividends",
    subscription: "Subscription",
    profile: "Mera Profile",
    logout: "Log Out",
    search: "Talash Karein",
    searchPlaceholder: "Likhein: kam risk cement stocks, banking sector high dividend",
    completeProfile: "Apna Profile Mukammal Karein",
    completeProfileDesc: "Apna investor profile banayein aur personalized investment roadmap hasil karein.",
    startSetup: "Shuru Karein",
    yourRoadmap: "Aapka AI Investment Roadmap",
    roadmapDesc: "Aapke risk profile ke mutabiq tayyar kiya gaya",
    welcomeMsg: "Aapki investments ka jaiza aur personalized mushware.",
    totalPortfolio: "Kul Portfolio Qeemat",
    todayChange: "Aaj Ki Tabdeeli",
    totalInvested: "Kul Lagayi Raqam",
    totalGain: "Kul Faida / Nuqsan",
    watchlist: "Watchlist",
    language: "Zaban",
    english: "English",
    romanUrdu: "Roman Urdu",
    signIn: "Dakhil Hon",
    signUp: "Naya Account",
    createAccount: "Account Banayein",
    forgotPassword: "Password Bhool Gaye?",
    emailSent: "Password reset link aapke email par bhej di gayi hai.",
    stockScreener: "Smart Stock Screener",
    screenerDesc: "Apni zaban mein stocks talash karein",
    results: "Nataaij",
    stocksFound: "stocks mile",
    sector: "Sector",
    price: "Qeemat",
    change: "Tabdeeli",
    divYield: "Div Yield",
    aiInsight: "AI Mashwara",
    personalDetails: "Zati Maloomat",
    investorProfile: "Investor Profile",
    saveChanges: "Save Karein",
    updateProfile: "Profile Update Karein",
    profileCompletion: "Profile Status",
    myProfile: "Mera Profile",
    age: "Umar",
    monthlyIncome: "Maheena Amdani (PKR)",
    riskAppetite: "Risk Lene Ki Salahiyat",
    conservative: "Conservative (Mehfooz)",
    moderate: "Moderate (Darmiyani)",
    aggressive: "Aggressive (Zyada Risk)",
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [investorProfile, setInvestorProfile] = useState<InvestorProfile | null>(null);
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("finzyx_language") as Language) || "english";
  });
  
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [dummyBalance, setDummyBalance] = useState<number>(50000);
  
  const [livePrices, setLivePrices] = useState<Record<string, LivePrice>>({});
  const [backendOnline, setBackendOnline] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Helper to map and enrich API holdings with names and sectors from static stock data
  const enrichHoldings = useCallback((apiHoldings: any[], prices: Record<string, LivePrice> = livePrices) => {
    return apiHoldings.map(h => {
      const stock = psxStocks.find(s => s.symbol === h.symbol.toUpperCase());
      const live = prices[h.symbol.toUpperCase()];
      return {
        symbol: h.symbol,
        name: stock?.name || h.symbol,
        quantity: h.quantity,
        buyPrice: h.buyPrice,
        currentPrice: live?.current_price || stock?.price || h.buyPrice,
        sector: stock?.sector || "Other"
      };
    });
  }, [livePrices]);

  // Load user data on startup if token is available
  const loadUserData = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    const me = await fetchMe();
    if (me) {
      setCurrentUser(me);
      setDummyBalance(me.dummy_balance);
      setBackendOnline(true);

      // Fetch related data
      const [hRes, wRes, pRes] = await Promise.all([
        fetchHoldings(),
        fetchWatchlist(),
        fetchProfile()
      ]);

      if (hRes) {
        setHoldings(enrichHoldings(hRes));
      }
      if (wRes) {
        setWatchlist(wRes);
      }
      if (pRes) {
        setInvestorProfile({
          age: pRes.age || "",
          income: pRes.income || "",
          riskAppetite: (pRes.risk_appetite as any) || "",
          completed: pRes.completed
        });
      }
    } else {
      // Invalid token, logout
      clearAuthToken();
      setCurrentUser(null);
    }
  }, [enrichHoldings]);

  // Check backend health and load user data on mount
  useEffect(() => {
    const init = async () => {
      const token = getAuthToken();
      if (token) {
        const online = await isBackendOnline();
        setBackendOnline(online);
        if (online) {
          await loadUserData();
        }
      }
      setIsInitializing(false);
    };
    init();
    const healthInterval = setInterval(async () => {
      const online = await isBackendOnline();
      setBackendOnline(online);
    }, 15_000);
    return () => clearInterval(healthInterval);
  }, [loadUserData]);

  // ── Live Price Fetching ─────────────────────────────────────────────────
  const refreshLivePrices = useCallback(async () => {
    // Fetch prices for tracked stocks + top 50 screener stocks
    const symbolSet = new Set<string>();
    holdings.forEach(h => symbolSet.add(h.symbol));
    watchlist.forEach(s => symbolSet.add(s));
    
    // Add top 50 stocks for the screener
    psxStocks.slice(0, 50).forEach(s => symbolSet.add(s.symbol));

    const allSymbols = Array.from(symbolSet);
    if (allSymbols.length === 0) return;

    // The backend caps at 20 per request, so we batch
    const batchSize = 20;
    const promises: Promise<LivePrice[]>[] = [];
    for (let i = 0; i < allSymbols.length; i += batchSize) {
      const batch = allSymbols.slice(i, i + batchSize);
      promises.push(fetchLivePrices(batch));
    }

    const dataBatches = await Promise.all(promises);
    const results = dataBatches.flat();

    if (results.length > 0) {
      setBackendOnline(true);
      const priceMap: Record<string, LivePrice> = {};
      results.forEach(r => {
        if (!r.error && r.current_price) {
          priceMap[r.symbol] = r;
        }
      });
      setLivePrices(prev => ({ ...prev, ...priceMap }));

      // Update currentPrice in holdings state
      setHoldings(prev => enrichHoldings(prev, priceMap));
    }
  }, [holdings.length, watchlist.length, enrichHoldings]);

  // Fetch live prices on login and every 60 seconds
  useEffect(() => {
    if (!currentUser) return;
    refreshLivePrices();
    const interval = setInterval(() => {
      refreshLivePrices();
    }, 60_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await loginUser(email, password);
    if (res) {
      setAuthToken(res.access_token);
      setCurrentUser(res.user);
      setDummyBalance(res.user.dummy_balance);
      
      const [hRes, wRes, pRes] = await Promise.all([
        fetchHoldings(),
        fetchWatchlist(),
        fetchProfile()
      ]);

      if (hRes) setHoldings(enrichHoldings(hRes));
      if (wRes) setWatchlist(wRes);
      if (pRes) {
        setInvestorProfile({
          age: pRes.age || "",
          income: pRes.income || "",
          riskAppetite: (pRes.risk_appetite as any) || "",
          completed: pRes.completed
        });
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    clearAuthToken();
    setCurrentUser(null);
    setInvestorProfile(null);
    setHoldings([]);
    setWatchlist([]);
    setDummyBalance(50000);
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const res = await signupUser(name, email, password);
    if (res.success) {
      return { success: true, message: res.message || "Verification code sent to email" };
    }
    return { success: false, message: res.message || "Signup failed" };
  };

  const verifySignup = async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
    const res = await verifySignupUser(email, code);
    if (res.success && res.data) {
      setAuthToken(res.data.access_token);
      setCurrentUser(res.data.user);
      setDummyBalance(res.data.user.dummy_balance);
      setHoldings([]);
      setWatchlist([]);
      setInvestorProfile({
        age: "",
        income: "",
        riskAppetite: "moderate",
        completed: false
      });
      return { success: true, message: "Account created successfully" };
    }
    return { success: false, message: res.message || "Verification failed" };
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const saveInvestorProfile = async (profile: InvestorProfile) => {
    const success = await updateProfile(profile.age, profile.income, profile.riskAppetite);
    if (success) {
      setInvestorProfile(profile);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("finzyx_language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const executeTrade = async (type: "buy" | "sell", symbol: string, quantity: number, price: number) => {
    if (!currentUser) return { success: false, message: "Not logged in" };
    if (quantity <= 0) return { success: false, message: "Invalid quantity" };
    
    const cleanSymbol = symbol.toUpperCase();
    const stock = psxStocks.find(s => s.symbol === cleanSymbol);
    if (!stock) return { success: false, message: "Stock not found" };

    const res = await executeTradeApi(cleanSymbol, quantity, price, type);
    if (res) {
      setDummyBalance(res.dummy_balance);
      setHoldings(enrichHoldings(res.holdings));
      return { success: true, message: `Successfully ${type === "buy" ? "bought" : "sold"} ${quantity} shares of ${cleanSymbol}` };
    } else {
      return { success: false, message: `Trade failed. Check balance or holding levels.` };
    }
  };

  const toggleWatchlist = async (symbol: string) => {
    if (!currentUser) return;
    const cleanSymbol = symbol.toUpperCase();
    const res = await toggleWatchlistApi(cleanSymbol);
    if (res) {
      setWatchlist(res);
    }
  };

  const profileComplete = !!(investorProfile?.completed);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        investorProfile,
        language,
        profileComplete,
        holdings,
        watchlist,
        dummyBalance,
        login,
        logout,
        signup,
        verifySignup,
        updateUser,
        saveInvestorProfile,
        setLanguage,
        t,
        executeTrade,
        toggleWatchlist,
        livePrices,
        refreshLivePrices,
        backendOnline,
        isInitializing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
