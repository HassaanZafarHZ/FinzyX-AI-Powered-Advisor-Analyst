import { useParams, useNavigate } from "react-router";
import { AppLayout } from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { ShariaComplianceCard } from "../components/ShariaComplianceCard";
import { TrendingUp, TrendingDown, Star, Plus, ArrowLeft, AlertCircle, Wallet } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getStockBySymbol, getChartData } from "../../data/psxStocks";
import { useApp } from "../../contexts/AppContext";
import { useState, useEffect, useMemo } from "react";
import { cn } from "../../lib/utils";
import { fetchStockDetail, fetchLivePrice, StockDetailData, LivePrice } from "../../services/psxApi";

const getRiskColor = (risk: string) => {
  if (risk === "low") return "text-success";
  if (risk === "high") return "text-destructive";
  return "text-warning";
};

const getAISummary = (symbol: string, name: string, sector: string, isCompliant: boolean, divYield: number, pe: number, language: string) => {
  const en = `${name} is a PSX-listed ${sector} company. ${
    isCompliant ? "The stock is fully Shariah-compliant and meets all Islamic finance criteria." : "Note: This stock has non-compliant revenue streams."
  } With a dividend yield of ${divYield}%, it ${divYield > 8 ? "offers attractive income for dividend investors" : "provides moderate income returns"}. The P/E ratio of ${pe} suggests the stock is ${pe < 8 ? "attractively valued relative to peers" : pe < 15 ? "fairly valued" : "growth-oriented"}. Analysts maintain a positive outlook on ${symbol} given Pakistan's economic growth trajectory and sector fundamentals.`;

  const romanUrdu = `${name} PSX par listed ek ${sector} company hai. ${
    isCompliant ? "Yeh stock Shariah-compliant hai aur Islamic finance ke tamam criteria ko pura karti hai." : "NOTE: Is stock mein kuch non-compliant revenue streams hain."
  } ${divYield}% dividend yield ke sath, yeh ${divYield > 8 ? "dividend investors ke liye behtareen hai" : "munasib income deti hai"}. P/E ratio ${pe} batata hai ke stock ${pe < 8 ? "peers ke mukable mein sasti hai" : pe < 15 ? "fair value par hai" : "growth-oriented hai"}. Analysts ${symbol} ke baray mein positive hain kyunki Pakistan ki economy aur ${sector} sector dono mazboot ho rahe hain.`;

  return { en, romanUrdu };
};

export const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { language, watchlist, toggleWatchlist, holdings, dummyBalance, executeTrade } = useApp();
  const [notification, setNotification] = useState("");
  const [tradeQuantity, setTradeQuantity] = useState("10");
  const [tradeError, setTradeError] = useState("");

  const inWatchlist = watchlist.includes((symbol || "").toUpperCase());
  const inPortfolio = holdings.some((h) => h.symbol === (symbol || "").toUpperCase());

  const stock = getStockBySymbol(symbol || "");
  const chartData = useMemo(() => getChartData(symbol || ""), [symbol]);

  // Live data from backend API
  const [livePrice, setLivePrice] = useState<LivePrice | null>(null);
  const [liveDetail, setLiveDetail] = useState<StockDetailData | null>(null);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    fetchLivePrice(symbol).then(data => {
      if (!cancelled && data) setLivePrice(data);
    });
    fetchStockDetail(symbol).then(data => {
      if (!cancelled && data) setLiveDetail(data);
    });
    return () => { cancelled = true; };
  }, [symbol]);

  // Merge live data with mock fallback
  const displayPrice = livePrice?.current_price ?? stock?.price ?? 0;
  const displayChange = livePrice?.change_percent ?? stock?.change ?? 0;
  const displayVolume = liveDetail?.quote_stats?.volume?.toLocaleString() ?? stock?.volume ?? "—";
  const displayMarketCap = liveDetail?.equity?.market_cap_thousands
    ? `PKR ${(liveDetail.equity.market_cap_thousands / 1000).toFixed(0)}M`
    : stock?.marketCap ?? "—";
  const displayPE = liveDetail?.quote_stats?.pe_ratio_ttm ?? stock?.pe ?? 0;
  const display52High = liveDetail?.quote_stats?.week52_high ?? stock?.high52w ?? 0;
  const display52Low = liveDetail?.quote_stats?.week52_low ?? stock?.low52w ?? 0;
  const displayDescription = liveDetail?.profile?.description ?? stock?.description ?? "";

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  if (!stock) {
    return (
      <AppLayout>
        <div className="w-full space-y-6">
          <div className="flex items-center gap-4 p-8 bg-destructive/5 border border-destructive/20 rounded-xl">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <h2 className="font-bold text-lg">Stock not found: {symbol}</h2>
              <p className="text-muted-foreground text-sm">
                {language === "roman-urdu"
                  ? "Yeh stock PSX database mein nahi mila."
                  : "This stock symbol was not found in our PSX database."}
              </p>
            </div>
          </div>
          <Button onClick={() => navigate("/screener")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Screener
          </Button>
        </div>
      </AppLayout>
    );
  }

  const aiSummary = getAISummary(stock.symbol, stock.name, stock.sector, stock.shariah, stock.divYield, stock.pe, language);

  return (
    <AppLayout>
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-success text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <span>✓</span> {notification}
        </div>
      )}

      <div className="w-full space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === "roman-urdu" ? "Wapis Jao" : "Back"}
        </button>

        {/* Stock Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold">{stock.symbol}</h1>
              <Badge variant="default">{stock.sector}</Badge>
              {/* E5-US2-TC1 & TC2: Shariah Compliance Labels */}
              {stock.shariah ? (
                <Badge variant="shariah">
                  {language === "roman-urdu" ? "✓ Shariah-Compliant (Halal)" : "✓ Shariah Compliant"}
                </Badge>
              ) : (
                <Badge variant="destructive">
                  {language === "roman-urdu" ? "✕ Shariah-Compliant Nahi Hai" : "✕ Not Shariah Compliant"}
                </Badge>
              )}
              <Badge
                className={cn(
                  "capitalize",
                  stock.riskLevel === "low"
                    ? "bg-success/10 text-success border-success/30"
                    : stock.riskLevel === "high"
                    ? "bg-destructive/10 text-destructive border-destructive/30"
                    : "bg-warning/10 text-warning border-warning/30"
                )}
              >
                {language === "roman-urdu"
                  ? stock.riskLevel === "low" ? "Kam Risk" : stock.riskLevel === "high" ? "Zyada Risk" : "Darmiyani Risk"
                  : `${stock.riskLevel} risk`}
              </Badge>
            </div>
            <p className="text-muted-foreground">{stock.name}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={inWatchlist ? "default" : "outline"}
              onClick={() => {
                toggleWatchlist(stock.symbol);
                showNotification(
                  inWatchlist
                    ? `${stock.symbol} removed from watchlist`
                    : `${stock.symbol} added to watchlist ⭐`
                );
              }}
            >
              <Star className={cn("h-4 w-4 mr-2", inWatchlist && "fill-current")} />
              {inWatchlist
                ? language === "roman-urdu" ? "Watchlist Mein Hai" : "In Watchlist"
                : language === "roman-urdu" ? "Watchlist Mein Shamil Karein" : "Add to Watchlist"
              }
            </Button>
          </div>
        </div>

        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Card */}
            <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 shadow-sm">
              <CardContent className="py-6">
                <div className="flex items-end justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {language === "roman-urdu" ? "Live PSX Qeemat" : "Live PSX Price"}
                    </p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-extrabold text-foreground">PKR {displayPrice.toLocaleString()}</span>
                      <span className={cn(
                        "text-base font-bold flex items-center gap-1",
                        displayChange > 0 ? "text-success" : "text-destructive"
                      )}>
                        {displayChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {displayChange > 0 ? "+" : ""}{displayChange}%
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {language === "roman-urdu" ? "Aaj ka tabadla" : "Today's change"}
                    </p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        {language === "roman-urdu" ? "Volume" : "Volume"}
                      </p>
                      <p className="text-base font-bold text-foreground mt-0.5">{displayVolume}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        {language === "roman-urdu" ? "Market Cap" : "Market Cap"}
                      </p>
                      <p className="text-base font-bold text-foreground mt-0.5">{displayMarketCap}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Chart */}
            <Card className="overflow-hidden shadow-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">
                    {language === "roman-urdu" ? "30 Din Ka Price Chart" : "30-Day Price Chart"}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={cn(
                      "font-bold",
                      displayChange >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {displayChange >= 0 ? "+" : ""}{displayChange}%
                    </span>
                    <span className="text-muted-foreground font-medium">Last 30 Days</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPriceGradientDetail" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={stock.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.25}/>
                        <stop offset="100%" stopColor={stock.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "#888888", fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#888888", fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      dx={-5}
                      domain={['dataMin - 2', 'dataMax + 2']}
                      tickFormatter={(value) => `${value.toFixed(0)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      }}
                      labelStyle={{
                        fontSize: "11px",
                        fontWeight: "600",
                        marginBottom: "4px",
                        color: "hsl(var(--foreground))"
                      }}
                      itemStyle={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: stock.change >= 0 ? "#10b981" : "#ef4444"
                      }}
                      formatter={(value: number) => [`PKR ${value.toFixed(2)}`, ""]}
                      cursor={{ stroke: stock.change >= 0 ? "#10b981" : "#ef4444", strokeWidth: 1, strokeOpacity: 0.3 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={stock.change >= 0 ? "#10b981" : "#ef4444"}
                      strokeWidth={2.5}
                      fill="url(#colorPriceGradientDetail)"
                      fillOpacity={1}
                      isAnimationActive={true}
                      animationDuration={800}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* AI Summary */}
            <Card className="shadow-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  <CardTitle className="text-base font-bold">
                    {language === "roman-urdu" ? "AI Ka Mashwara" : "AI Analyst View"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {displayDescription ? (
                  <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                    {displayDescription}
                  </p>
                ) : (
                  <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                    {language === "roman-urdu" ? aiSummary.romanUrdu : aiSummary.en}
                  </p>
                )}
                {liveDetail?.profile?.website && (
                  <a href={liveDetail.profile.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">
                    Visit Company Website →
                  </a>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-6">
            {/* Trade Simulator Widget */}
            <Card className="shadow-sm border-primary/20 overflow-hidden">
              <div className="bg-primary/5 border-b border-primary/10 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Trade Simulator</span>
                </div>
                <div className="text-xs font-bold text-muted-foreground">
                  Balance: PKR {dummyBalance.toLocaleString()}
                </div>
              </div>
              <CardContent className="pt-5 space-y-4">
                {tradeError && (
                  <div className="bg-destructive/10 text-destructive text-[11px] font-medium p-2 rounded-md">
                    {tradeError}
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Quantity (Shares)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={tradeQuantity} 
                    onChange={(e) => {
                      setTradeQuantity(e.target.value);
                      setTradeError("");
                    }}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="flex justify-between items-center py-2 px-3 bg-muted/30 rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground">Est. Total:</span>
                  <span className="text-sm font-bold">
                    PKR {((Number(tradeQuantity) || 0) * stock.price).toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-3 pt-1">
                  <Button 
                    className="flex-1 bg-success hover:bg-success/90 text-white shadow-sm"
                    onClick={async () => {
                      const qty = Number(tradeQuantity);
                      if (qty <= 0) {
                        setTradeError("Enter a valid quantity");
                        return;
                      }
                      const res = await executeTrade("buy", stock.symbol, qty, stock.price);
                      if (res.success) {
                        showNotification(res.message);
                        setTradeQuantity("10");
                      } else {
                        setTradeError(res.message);
                      }
                    }}
                  >
                    Buy
                  </Button>
                  <Button 
                    className="flex-1"
                    variant="outline"
                    onClick={async () => {
                      const qty = Number(tradeQuantity);
                      if (qty <= 0) {
                        setTradeError("Enter a valid quantity");
                        return;
                      }
                      const res = await executeTrade("sell", stock.symbol, qty, stock.price);
                      if (res.success) {
                        showNotification(res.message);
                        setTradeQuantity("10");
                      } else {
                        setTradeError(res.message);
                      }
                    }}
                    disabled={!inPortfolio}
                  >
                    Sell
                  </Button>
                </div>
                {inPortfolio && (
                  <p className="text-[10px] text-center text-muted-foreground mt-2">
                    You currently own <strong>{holdings.find(h => h.symbol === stock.symbol)?.quantity}</strong> shares
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Key Metrics Widget */}
            <Card className="shadow-sm">
              <CardHeader className="border-b border-border/40 pb-3">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>Key Metrics</span>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Ratios & Ranges</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-border/60">
                <div className="flex justify-between items-center py-3.5 px-5">
                  <span className="text-xs font-medium text-muted-foreground">Dividend Yield</span>
                  <span className="text-xs font-bold text-success">{stock.divYield}%</span>
                </div>
                <div className="flex justify-between items-center py-3.5 px-5">
                  <span className="text-xs font-medium text-muted-foreground">P/E Ratio</span>
                  <span className="text-xs font-bold text-foreground">{displayPE > 0 ? displayPE : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-3.5 px-5">
                  <span className="text-xs font-medium text-muted-foreground">52-Week High</span>
                  <span className="text-xs font-bold text-foreground">PKR {display52High.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3.5 px-5">
                  <span className="text-xs font-medium text-muted-foreground">52-Week Low</span>
                  <span className="text-xs font-bold text-foreground">PKR {display52Low.toLocaleString()}</span>
                </div>
                {liveDetail?.quote_stats?.open != null && (
                  <div className="flex justify-between items-center py-3.5 px-5">
                    <span className="text-xs font-medium text-muted-foreground">Open</span>
                    <span className="text-xs font-bold text-foreground">PKR {liveDetail.quote_stats.open.toLocaleString()}</span>
                  </div>
                )}
                {liveDetail?.quote_stats?.high != null && (
                  <div className="flex justify-between items-center py-3.5 px-5">
                    <span className="text-xs font-medium text-muted-foreground">Day High</span>
                    <span className="text-xs font-bold text-foreground">PKR {liveDetail.quote_stats.high.toLocaleString()}</span>
                  </div>
                )}
                {liveDetail?.quote_stats?.low != null && (
                  <div className="flex justify-between items-center py-3.5 px-5">
                    <span className="text-xs font-medium text-muted-foreground">Day Low</span>
                    <span className="text-xs font-bold text-foreground">PKR {liveDetail.quote_stats.low.toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shariah Compliance Card */}
            <ShariaComplianceCard isCompliant={stock.shariah} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
