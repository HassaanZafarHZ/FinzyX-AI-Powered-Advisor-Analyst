import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { AppLayout } from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Badge } from "../components/Badge";
import { TrendingUp, TrendingDown, Briefcase, DollarSign, UserCheck, ChevronRight, CheckCircle, X, BookOpen, Award, Lock, Newspaper, Clock } from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useApp } from "../../contexts/AppContext";
import { cn } from "../../lib/utils";
import { psxStocks } from "../../data/psxStocks";
import { fetchMarketNews, NewsItem } from "../../services/psxApi";

interface ProfileModalProps {
  onClose: () => void;
  onComplete: () => void;
}

const ProfileSetupModal = ({ onClose, onComplete }: ProfileModalProps) => {
  const { saveInvestorProfile } = useApp();
  const [step, setStep] = useState(1);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [formData, setFormData] = useState({
    age: "",
    income: "",
    riskAppetite: "" as "conservative" | "moderate" | "aggressive" | "",
  });

  const risks = [
    { value: "conservative" as const, label: "Conservative (Mehfooz)", icon: "🛡️", desc: "Low risk, stable returns" },
    { value: "moderate" as const, label: "Moderate (Darmiyani)", icon: "⚖️", desc: "Balanced risk & growth" },
    { value: "aggressive" as const, label: "Aggressive (Zyada Risk)", icon: "🚀", desc: "High risk, high reward" },
  ];

  const loadingSteps = [
    "Analyzing age & risk profile...",
    "Filtering Shariah-compliant equities...",
    "Structuring dividend targets & generating roadmap...",
  ];

  useEffect(() => {
    if (!loadingRoadmap) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= 2) {
          clearInterval(interval);
          setTimeout(() => {
            setLoadingRoadmap(false);
            setShowWelcome(true);
          }, 800);
          return 3;
        }
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [loadingRoadmap]);

  const [errorMsg, setErrorMsg] = useState("");
  const [ageError, setAgeError] = useState(false);
  const [incomeError, setIncomeError] = useState(false);

  const handleStep1Next = () => {
    setErrorMsg("");
    setAgeError(false);
    setIncomeError(false);

    if (!formData.age || !formData.income) {
      setErrorMsg("Please complete all required fields.");
      setAgeError(!formData.age);
      setIncomeError(!formData.income);
      return;
    }

    const ageVal = Number(formData.age);
    const incomeVal = Number(formData.income);
    let ageErr = false;
    let incomeErr = false;
    let hasErr = false;

    if (ageVal <= 0 || ageVal > 150) {
      ageErr = true;
      hasErr = true;
    }
    if (incomeVal <= 0) {
      incomeErr = true;
      hasErr = true;
    }

    if (hasErr) {
      setErrorMsg("Please enter a valid age and income.");
      setAgeError(ageErr);
      setIncomeError(incomeErr);
      return;
    }

    setStep(2);
  };

  const handleComplete = () => {
    saveInvestorProfile({
      age: formData.age,
      income: formData.income,
      riskAppetite: formData.riskAppetite,
      completed: true,
    });
    setLoadingRoadmap(true);
    setLoadingStep(0);
  };

  if (loadingRoadmap) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="relative w-20 h-20 mx-auto">
            {/* Spinning gradient ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            {/* Pulsing inner icon */}
            <div className="absolute inset-2 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xl">🤖</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-foreground">AI Advisor Working</h3>
            <p className="text-sm text-muted-foreground transition-all duration-300 min-h-[40px]">
              {loadingSteps[loadingStep] || "Finalizing your roadmap..."}
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500 ease-out"
              style={{ width: `${((loadingStep + 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Profile Set! 🎉</h2>
            <p className="text-white/85">Welcome to FinzyX!</p>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Your <strong className="text-foreground capitalize">{formData.riskAppetite}</strong> investor profile and
              AI roadmap are ready. Start exploring PSX stocks!
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="font-bold">{formData.age}y</p>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Income</p>
                <p className="font-bold text-xs">PKR {Number(formData.income).toLocaleString()}</p>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Risk</p>
                <p className="font-bold text-xs capitalize">{formData.riskAppetite}</p>
              </div>
            </div>
            <Button onClick={onComplete} className="w-full" size="lg">
              View My Dashboard 🚀
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-bold text-lg">Complete Your Investor Profile</h2>
            <p className="text-sm text-muted-foreground">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn("h-1.5 flex-1 rounded-full transition-colors", s <= step ? "bg-primary" : "bg-muted")}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Personal Information</h3>
              {errorMsg && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
                  {errorMsg}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Age (Umar)</label>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  error={ageError}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Income / Maheena Amdani (PKR)</label>
                <Input
                  type="number"
                  placeholder="e.g. 150000"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  error={incomeError}
                  required
                />
              </div>
              <Button
                onClick={handleStep1Next}
                className="w-full"
              >
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Risk Appetite / Risk Pasandeedgi</h3>
              <div className="space-y-3">
                {risks.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setFormData({ ...formData, riskAppetite: r.value })}
                    className={cn(
                      "w-full p-4 rounded-lg border-2 text-left transition-all",
                      formData.riskAppetite === r.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{r.icon}</span>
                      <div>
                        <p className="font-semibold">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.desc}</p>
                      </div>
                      {formData.riskAppetite === r.value && (
                        <CheckCircle className="h-5 w-5 text-primary ml-auto shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1"
                  disabled={!formData.riskAppetite}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Confirm & Generate Roadmap</h3>
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Age</span>
                  <span className="font-medium">{formData.age} years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Income</span>
                  <span className="font-medium">PKR {Number(formData.income).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk Profile</span>
                  <span className="font-medium capitalize">{formData.riskAppetite}</span>
                </div>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm">
                  🤖 AI will generate your personalized PSX investment roadmap with stock recommendations,
                  sector allocation, and dividend targets.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                <Button onClick={handleComplete} className="flex-1">
                  Generate Roadmap 🚀
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getRoadmapData = (risk: string) => {
  const data = {
    conservative: { 
      equity: "30%", 
      fixed: "70%", 
      dividend: "10.5%", 
      sectors: ["Banking", "Fertilizer", "Power"], 
      gradient: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-500/20 dark:border-emerald-500/30",
      glow: "from-emerald-500/20 to-teal-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300"
    },
    moderate: { 
      equity: "60%", 
      fixed: "40%", 
      dividend: "8.2%", 
      sectors: ["Banking", "Cement", "Energy"], 
      gradient: "from-indigo-500/10 to-purple-500/5",
      border: "border-indigo-500/20 dark:border-indigo-500/30",
      glow: "from-indigo-500/20 to-purple-500/20",
      text: "text-indigo-600 dark:text-indigo-400",
      badge: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300"
    },
    aggressive: { 
      equity: "85%", 
      fixed: "15%", 
      dividend: "5.5%", 
      sectors: ["Technology", "Automobile", "Chemicals"], 
      gradient: "from-violet-600/15 to-pink-600/5",
      border: "border-pink-500/20 dark:border-pink-500/30",
      glow: "from-violet-600/20 to-pink-600/20",
      text: "text-pink-600 dark:text-pink-400",
      badge: "bg-pink-500/10 text-pink-600 border-pink-500/30 dark:bg-pink-500/20 dark:text-pink-300"
    },
  };
  return data[risk as keyof typeof data] || data.moderate;
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, investorProfile, profileComplete, t, watchlist, holdings, language, livePrices } = useApp();
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [liveNews, setLiveNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setNewsLoading(true);
    fetchMarketNews().then(res => {
      if (active && res && res.items) {
        setLiveNews(res.items);
      }
    }).catch(err => {
      console.warn("Failed to fetch news:", err);
    }).finally(() => {
      if (active) setNewsLoading(false);
    });
    return () => { active = false; };
  }, []);

  // Mock News Feed
  const newsFeed = [
    {
      id: 1,
      titleEn: "PSX hits all-time high: What does it mean for beginners?",
      titleUrdu: "PSX naye bulandiyon par: Naye investors ke liye iska kya matlab hai?",
      tagEn: "Market Basics",
      tagUrdu: "Market Bunyadi",
      tagVariant: "default" as const,
      readTimeEn: "2 min read",
      readTimeUrdu: "2 min parhein",
      descEn: "Pakistan Stock Exchange continues its bull run. For beginners, it is critical to focus on valuation rather than FOMO.",
      descUrdu: "Pakistan Stock Exchange mein tezi barkrar hai. Naye investors ke liye zaroori hai ke woh FOMO ke bajaye valuation par tawajjah dein."
    },
    {
      id: 2,
      titleEn: "Understanding Dividend Yield: Passive Income on PSX",
      titleUrdu: "Dividend Yield ko Samjhein: PSX par passive income hasil karein",
      tagEn: "Dividend",
      tagUrdu: "Kamaai",
      tagVariant: "shariah" as const,
      readTimeEn: "3 min read",
      readTimeUrdu: "3 min parhein",
      descEn: "Dividends are payments made by companies to shareholders. Learn how dividend yield helps build a regular income stream.",
      descUrdu: "Dividends companies ki taraf se shareholders ko diye jane wale paise hain. Samjhein ke dividend yield se regular income kaise banti hai."
    },
    {
      id: 3,
      titleEn: "Why Shariah Screening Criteria matters in Stock Selection",
      titleUrdu: "Stock Selection mein Shariah Screening kyun zaroori hai?",
      tagEn: "Halal Investing",
      tagUrdu: "Halal Investment",
      tagVariant: "secondary" as const,
      readTimeEn: "4 min read",
      readTimeUrdu: "4 min parhein",
      descEn: "Discover the financial and business screening rules used to identify Halal stocks on the Pakistan Stock Exchange.",
      descUrdu: "PSX par Halal stocks ki pehchan ke liye istemal hone wale karobari aur maliyati rules ke baray mein janiye."
    }
  ];

  // Mock Learning Roadmap Modules
  const learningModules = [
    { id: 1, nameEn: "Introduction to Stock Market", nameUrdu: "Stock Market Ka Taaruf", status: "completed" },
    { id: 2, nameEn: "Shariah Compliance Rules", nameUrdu: "Shariah Compliant Rules", status: "completed" },
    { id: 3, nameEn: "Portfolio Diversification", nameUrdu: "Portfolio Diversification", status: "in-progress" },
    { id: 4, nameEn: "Understanding Financial Ratios", nameUrdu: "Financial Ratios Samjhein", status: "locked" },
    { id: 5, nameEn: "Risk Management Strategies", nameUrdu: "Risk Management Tareeqay", status: "locked" }
  ];

  const userName = currentUser?.name?.split(" ")[0] || "Investor";
  const roadmap = getRoadmapData(investorProfile?.riskAppetite || "moderate");

  // Dynamic calculations from holdings context
  const totalValue = holdings.reduce((sum, h) => sum + h.currentPrice * h.quantity, 0);
  const totalInvested = holdings.reduce((sum, h) => sum + h.buyPrice * h.quantity, 0);
  const totalGain = totalValue - totalInvested;
  const totalGainPercent = totalInvested ? ((totalGain / totalInvested) * 100).toFixed(2) : "0.00";


  const todayChange = holdings.reduce((sum, h) => {
    const stock = psxStocks.find(s => s.symbol === h.symbol);
    if (!stock) return sum;
    const val = h.currentPrice * h.quantity;
    const prevPrice = h.currentPrice / (1 + stock.change / 100);
    const changeAmt = val - (prevPrice * h.quantity);
    return sum + changeAmt;
  }, 0);
  const todayChangePercent = totalValue ? ((todayChange / (totalValue - todayChange)) * 100).toFixed(2) : "0.00";

  // Dynamic watchlist stocks mapping
  const watchlistStocks = psxStocks
    .filter(stock => watchlist.includes(stock.symbol))
    .map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      yield: stock.divYield,
      sector: stock.sector,
      shariah: stock.shariah
    }));

  return (
    <>
      {showProfileModal && (
        <ProfileSetupModal
          onClose={() => setShowProfileModal(false)}
          onComplete={() => setShowProfileModal(false)}
        />
      )}

      <AppLayout>
        <div className="space-y-6 w-full">
          {/* Welcome Banner - FULL WIDTH */}
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-purple-500/5 to-transparent border border-primary/15 rounded-2xl p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-1 tracking-tight">
              {t("welcome")}, {userName}! 👋
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg">{t("welcomeMsg")}</p>
          </div>

          {/* Stats Cards - FULL WIDTH ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Portfolio Value */}
            <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("totalPortfolio")}</CardTitle>
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold tracking-tight">PKR {totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1.5">Current market value</p>
              </CardContent>
            </Card>

            {/* Card 2: Today's Change */}
            <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("todayChange")}</CardTitle>
                <div className={cn("p-1.5 rounded-lg", todayChange >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                  {todayChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl font-extrabold tracking-tight", todayChange >= 0 ? "text-success" : "text-destructive")}>
                  {todayChange >= 0 ? "+" : ""}PKR {todayChange.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  <span className={cn("font-semibold mr-1", todayChange >= 0 ? "text-success" : "text-destructive")}>
                    {todayChange >= 0 ? "+" : ""}{todayChangePercent}%
                  </span>
                  change today
                </p>
              </CardContent>
            </Card>

            {/* Card 3: Total Invested */}
            <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("totalInvested")}</CardTitle>
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <DollarSign className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold tracking-tight">PKR {totalInvested.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Across <span className="font-semibold text-foreground">{holdings.length}</span> active holdings
                </p>
              </CardContent>
            </Card>

            {/* Card 4: Total Gain/Loss */}
            <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("totalGain")}</CardTitle>
                <div className={cn("p-1.5 rounded-lg", totalGain >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                  {totalGain >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl font-extrabold tracking-tight", totalGain >= 0 ? "text-success" : "text-destructive")}>
                  {totalGain >= 0 ? "+" : ""}PKR {totalGain.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  <span className={cn("font-semibold mr-1", totalGain >= 0 ? "text-success" : "text-destructive")}>
                    {totalGain >= 0 ? "+" : ""}{totalGainPercent}%
                  </span>
                  total return
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Grid: Watchlist & Sidebar side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
            {/* Watchlist on the Left (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="border-b border-border/40 pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg font-bold">{t("watchlist")}</span>
                    <Link to="/screener" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                      View All Stocks <ChevronRight className="h-3 w-3" />
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {watchlistStocks.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-muted/20">
                            <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("sector")}</th>
                            <th className="text-center py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Compliance</th>
                            <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("price")}</th>
                            <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("change")}</th>
                            <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("divYield")}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {watchlistStocks.map((stock) => {
                            const live = livePrices[stock.symbol];
                            const price = live?.current_price ?? stock.price;
                            const change = live?.change_percent ?? stock.change;
                            return (
                            <tr
                              key={stock.symbol}
                              className="hover:bg-muted/30 cursor-pointer transition-colors"
                              onClick={() => navigate(`/stock/${stock.symbol}`)}
                            >
                              <td className="py-3 px-6">
                                <div>
                                  <div className="font-semibold text-sm text-foreground">{stock.symbol}</div>
                                  <div className="text-xs text-muted-foreground">{stock.name}</div>
                                </div>
                              </td>
                              <td className="py-3 px-6">
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">{stock.sector}</Badge>
                              </td>
                              <td className="py-3 px-6 text-center">
                                {stock.shariah ? (
                                  <Badge className="bg-shariah-background border border-shariah-border text-shariah-text text-[10px] font-bold uppercase tracking-wider">
                                    Shariah Compliant
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                                    Non-Compliant
                                  </Badge>
                                )}
                              </td>
                              <td className="py-3 px-6 text-right font-semibold text-sm">PKR {price.toLocaleString()}</td>
                              <td className="py-3 px-6 text-right">
                                <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full", change > 0 ? "text-success bg-success/10" : change < 0 ? "text-destructive bg-destructive/10" : "text-muted-foreground bg-muted")}>
                                  {change > 0 ? "+" : ""}{change}%
                                </span>
                              </td>
                              <td className="py-3 px-6 text-right font-semibold text-sm text-muted-foreground">{stock.yield}%</td>
                            </tr>
                          )})}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground space-y-3">
                      <p className="text-sm">No stocks in your watchlist yet.</p>
                      <Button onClick={() => navigate("/screener")} variant="outline" size="sm" className="shadow-sm">
                        Explore Screener
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Market News Feed Widget */}
              <Card className="shadow-sm border-primary/10 overflow-hidden">
                <CardHeader className="border-b border-border/40 pb-4 flex flex-row items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Newspaper className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">
                      {language === "roman-urdu" ? "Simplified Market News" : "Market News Feed"}
                    </CardTitle>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {language === "roman-urdu" ? "Naye investors ke liye asan khabrein" : "Easy to understand updates for beginners"}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="divide-y divide-border/60 p-0">
                  {newsLoading ? (
                    <div className="p-8 text-center text-muted-foreground space-y-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent mx-auto" />
                      <p className="text-xs">Fetching live business updates...</p>
                    </div>
                  ) : liveNews.length > 0 ? (
                    liveNews.slice(0, 10).map((news, idx) => (
                      <a
                        key={idx}
                        href={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-5 hover:bg-muted/10 transition-colors space-y-2.5"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                              {news.category || "Business"}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Recently"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground hover:text-primary transition-colors leading-snug">
                            {news.title}
                          </h4>
                          {news.description && (
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                              {news.description}
                            </p>
                          )}
                        </div>
                      </a>
                    ))
                  ) : (
                    // Fallback to mock data if offline or empty
                    newsFeed.map((news) => (
                      <div key={news.id} className="p-5 hover:bg-muted/10 transition-colors space-y-2.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={news.tagVariant} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                              {language === "roman-urdu" ? news.tagUrdu : news.tagEn}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {language === "roman-urdu" ? news.readTimeUrdu : news.readTimeEn}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground hover:text-primary transition-colors cursor-pointer leading-snug">
                            {language === "roman-urdu" ? news.titleUrdu : news.titleEn}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {language === "roman-urdu" ? news.descUrdu : news.descEn}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Column on the Right (1/3 width) */}
            <div className="space-y-6">
              {/* Complete Profile Setup Banner / Active Roadmap */}
              {!profileComplete ? (
                <div className="bg-gradient-to-br from-primary/15 via-purple-500/5 to-transparent border border-primary/20 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center animate-pulse">
                    <UserCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">
                      {t("completeProfile")}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t("completeProfileDesc")}
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowProfileModal(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm font-semibold transition-all duration-300"
                  >
                    {t("startSetup")}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ) : (
                investorProfile && (
                  <div className={cn(
                    "relative overflow-hidden rounded-2xl border p-6 bg-gradient-to-br shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
                    roadmap.gradient,
                    roadmap.border
                  )}>
                    {/* Blur orb decoration */}
                    <div className={cn("absolute -right-24 -top-24 w-56 h-56 rounded-full blur-3xl opacity-40 bg-gradient-to-br pointer-events-none", roadmap.glow)} />
                    
                    <div className="relative z-10 flex items-start justify-between mb-5">
                      <div>
                        <h2 className="text-lg font-bold mb-1 text-foreground flex items-center gap-2">
                          <span>🤖</span>
                          {t("yourRoadmap")}
                        </h2>
                        <p className="text-muted-foreground text-xs">
                          {t("roadmapDesc")} —{" "}
                          <span className={cn("capitalize font-semibold", roadmap.text)}>
                            {investorProfile.riskAppetite === "aggressive" 
                              ? (language === "roman-urdu" ? "Aggressive (Zyada Risk)" : "Aggressive")
                              : investorProfile.riskAppetite === "conservative"
                              ? (language === "roman-urdu" ? "Conservative (Mehfooz)" : "Conservative")
                              : (language === "roman-urdu" ? "Moderate (Darmiyani)" : "Moderate")
                            }
                          </span>
                        </p>
                      </div>
                      <Badge variant="outline" className={cn("border-none text-[10px] font-bold tracking-wider", roadmap.badge)}>Active</Badge>
                    </div>

                    <div className="relative z-10 space-y-3 mb-5">
                      <div className="bg-card/50 backdrop-blur-md border border-border/40 rounded-xl p-3 flex justify-between items-center transition-all hover:bg-card/85">
                        <span className="text-xs text-muted-foreground font-medium">Equity Allocation</span>
                        <span className="text-lg font-extrabold text-foreground">{roadmap.equity}</span>
                      </div>
                      <div className="bg-card/50 backdrop-blur-md border border-border/40 rounded-xl p-3 flex justify-between items-center transition-all hover:bg-card/85">
                        <span className="text-xs text-muted-foreground font-medium">Fixed Income</span>
                        <span className="text-lg font-extrabold text-foreground">{roadmap.fixed}</span>
                      </div>
                      <div className="bg-card/50 backdrop-blur-md border border-border/40 rounded-xl p-3 flex justify-between items-center transition-all hover:bg-card/85">
                        <span className="text-xs text-muted-foreground font-medium">Expected Yield</span>
                        <span className="text-lg font-extrabold text-foreground">{roadmap.dividend}</span>
                      </div>
                    </div>

                    <div className="relative z-10 flex flex-wrap gap-1.5 mb-5">
                      {roadmap.sectors.map((s) => (
                        <Badge key={s} variant="secondary" className="px-2 py-0.5 text-[10px] font-semibold">
                          {s}
                        </Badge>
                      ))}
                    </div>

                    <div className="relative z-10">
                      <Button
                        onClick={() => navigate("/screener")}
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm font-semibold"
                      >
                        Explore Stocks →
                      </Button>
                    </div>
                  </div>
                )
              )}

              {/* Learning Roadmap Progress Card */}
              <Card className="shadow-sm border-primary/10 overflow-hidden">
                <CardHeader className="border-b border-border/40 pb-4 flex flex-row items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">
                      {language === "roman-urdu" ? "Mera Seekhne Ka Safar" : "Learning Progress"}
                    </CardTitle>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {language === "roman-urdu" ? "Apna financial knowledge barhayein" : "Level up your financial literacy"}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                      <span>40% Completed</span>
                      <span>2/5 Modules</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/40">
                      <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: "40%" }} />
                    </div>
                  </div>

                  {/* Module List */}
                  <div className="space-y-2.5">
                    {learningModules.map((mod) => (
                      <div 
                        key={mod.id} 
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-xl border transition-colors",
                          mod.status === "completed" 
                            ? "bg-success/5 border-success/20 text-success" 
                            : mod.status === "in-progress"
                            ? "bg-primary/5 border-primary/20 text-primary font-semibold"
                            : "bg-muted/10 border-border/40 text-muted-foreground opacity-75"
                        )}
                      >
                        <div className="flex items-center gap-2 text-xs">
                          {mod.status === "completed" && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
                          {mod.status === "in-progress" && <BookOpen className="w-3.5 h-3.5 shrink-0 animate-pulse" />}
                          {mod.status === "locked" && <Lock className="w-3.5 h-3.5 shrink-0" />}
                          <span className="truncate max-w-[170px]">
                            {language === "roman-urdu" ? mod.nameUrdu : mod.nameEn}
                          </span>
                        </div>
                        <Badge 
                          variant={
                            mod.status === "completed" 
                              ? "success" 
                              : mod.status === "in-progress" 
                              ? "default" 
                              : "secondary"
                          } 
                          className="text-[9px] uppercase font-extrabold tracking-wider scale-90"
                        >
                          {mod.status === "completed" 
                            ? (language === "roman-urdu" ? "Mukammal" : "Done")
                            : mod.status === "in-progress"
                            ? (language === "roman-urdu" ? "Jari Hai" : "Active")
                            : (language === "roman-urdu" ? "Locked" : "Locked")
                          }
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-sm flex items-center justify-center gap-1.5"
                    size="sm"
                    onClick={() => navigate("/ai-rahbar")}
                  >
                    <Award className="w-3.5 h-3.5" />
                    {language === "roman-urdu" ? "Safar Jari Rakhin" : "Continue Learning"}
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => navigate("/ai-rahbar")}
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start text-xs font-medium hover:bg-primary/5 hover:text-primary transition-all duration-200"
                  >
                    💬 Chat with AI Rahbar
                  </Button>
                  <Button 
                    onClick={() => navigate("/portfolio")}
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start text-xs font-medium hover:bg-primary/5 hover:text-primary transition-all duration-200"
                  >
                    📊 Manage Trades
                  </Button>
                  <Button 
                    onClick={() => navigate("/dividends")}
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start text-xs font-medium hover:bg-primary/5 hover:text-primary transition-all duration-200"
                  >
                    💰 View Estimated Payouts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};
