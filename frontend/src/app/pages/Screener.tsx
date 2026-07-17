import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { AppLayout } from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { ShariaToggle } from "../components/ShariaToggle";
import { Search, Star, Loader2, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { psxStocks, nlpSearch, PSXStock } from "../../data/psxStocks";
import { cn } from "../../lib/utils";

export const Screener = () => {
  const navigate = useNavigate();
  const { language, t, watchlist, toggleWatchlist, livePrices } = useApp();
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [shariaFilter, setShariaFilter] = useState(false);
  const [goalFilter, setGoalFilter] = useState<"all" | "income" | "growth" | "safe">("all");
  const [riskFilter, setRiskFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<{ stocks: PSXStock[]; aiExplanation: string; aiExplanationRomanUrdu: string } | null>(null);

  const filterStocks = (stocksList: PSXStock[]) => {
    return stocksList.filter((stock) => {
      if (shariaFilter && !stock.shariah) return false;
      
      if (goalFilter === "income" && stock.divYield < 7.0) return false;
      if (goalFilter === "growth" && stock.pe < 10.0 && stock.sector !== "Technology" && stock.sector !== "Automobile") return false;
      if (goalFilter === "safe" && stock.riskLevel !== "low") return false;

      if (riskFilter !== "all" && stock.riskLevel !== riskFilter) return false;

      return true;
    });
  };

  const displayedStocks = filterStocks(
    hasSearched && searchResult
      ? searchResult.stocks
      : psxStocks.slice(0, 50)
  );

  const aiText = searchResult
    ? language === "roman-urdu"
      ? searchResult.aiExplanationRomanUrdu
      : searchResult.aiExplanation
    : "";

  const handleSearch = useCallback(() => {
    if (!searchInput.trim() && !shariaFilter) {
      setHasSearched(false);
      setSearchResult(null);
      return;
    }
    setLoading(true);
    setQuery(searchInput);
    // Simulate slight delay for NLP feel
    setTimeout(() => {
      const result = nlpSearch(searchInput, shariaFilter);
      setSearchResult(result);
      setHasSearched(true);
      setLoading(false);
    }, 600);
  }, [searchInput, shariaFilter]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };



  const quickSearches = language === "roman-urdu"
    ? ["cement stocks", "high dividend banking", "low risk stocks", "oil gas stocks", "tech stocks", "kam risk stocks"]
    : ["low risk cement stocks", "high dividend banking sector", "Shariah compliant energy", "fertilizer stocks", "technology growth"];

  return (
    <AppLayout>
      <div className="w-full space-y-6">
        {/* Page Title & Search Bar - Full Width */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              {t("stockScreener")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("screenerDesc")}</p>
          </div>
        </div>

        {/* Search Bar Card */}
        <Card className="border-primary/15 shadow-sm">
          <CardContent className="pt-6 pb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("searchPlaceholder")}
                  className="pl-10 h-12 text-sm"
                />
              </div>
              <Button onClick={handleSearch} size="lg" disabled={loading} className="px-6 h-12 shadow-sm font-semibold">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>{t("search")}</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Split Grid: Results on Left (2/3), Filters/Guides on Right (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
          {/* Main Area: Results (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {shariaFilter && (
              <div className="bg-shariah-background border border-shariah-border rounded-xl p-4 flex items-center gap-3 animate-in fade-in duration-300">
                <span className="text-2xl">☪️</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-shariah-text">Shariah Filter Active</p>
                  <p className="text-xs text-shariah-text/80">
                    {language === "roman-urdu"
                      ? "Sirf Shariah-compliant (Halal) stocks dikhaye ja rahe hain"
                      : "Showing only Shariah-compliant stocks verified by Islamic finance criteria"}
                  </p>
                </div>
                <Badge variant="shariah" className="border-none font-bold uppercase tracking-wider text-[10px]">Active</Badge>
              </div>
            )}

            {/* AI Insight Box */}
            {hasSearched && aiText && (
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1 text-foreground">{t("aiInsight")}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{aiText}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Results Table Card */}
            <Card className="shadow-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-base font-bold">{hasSearched ? t("results") : language === "roman-urdu" ? "Tamam PSX Stocks" : "All PSX Stocks"}</span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {displayedStocks.length} {t("stocksFound")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground text-sm font-medium">
                      {language === "roman-urdu" ? "AI talash kar raha hai..." : "AI is searching PSX stocks..."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/20">
                          <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                          <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("sector")}</th>
                          <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("price")}</th>
                          <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("change")}</th>
                          <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("divYield")}</th>
                          <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">P/E</th>
                          <th className="text-center py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Shariah</th>
                          <th className="text-center py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Watch</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {displayedStocks.map((stock) => {
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
                            <td className="py-3 px-6 text-right font-semibold text-sm">
                              PKR {price.toLocaleString()}
                            </td>
                            <td className="py-3 px-6 text-right">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full",
                                  change > 0 
                                    ? "text-success bg-success/10" 
                                    : change < 0 
                                    ? "text-destructive bg-destructive/10" 
                                    : "text-muted-foreground bg-muted"
                                )}
                              >
                                {change > 0 ? "+" : ""}{change}%
                              </span>
                            </td>
                            <td className="py-3 px-6 text-right font-semibold text-sm text-muted-foreground">{stock.divYield}%</td>
                            <td className="py-3 px-6 text-right text-sm font-semibold text-muted-foreground">{stock.pe > 0 ? stock.pe : "—"}</td>
                            <td className="py-3 px-6 text-center">
                              <Badge
                                variant={stock.shariah ? "shariah" : "not-compliant"}
                                className="text-[10px] font-bold tracking-wider uppercase border-none"
                              >
                                {stock.shariah ? "✓ Halal" : "✗ Non"}
                              </Badge>
                            </td>
                            <td className="py-3 px-6 text-center" onClick={(e) => {
                              e.stopPropagation();
                              toggleWatchlist(stock.symbol);
                            }}>
                              <button className={cn(
                                "transition-colors p-1 rounded-md hover:bg-muted/50",
                                watchlist.includes(stock.symbol.toUpperCase()) ? "text-warning" : "text-muted-foreground hover:text-warning"
                              )}>
                                {watchlist.includes(stock.symbol.toUpperCase())
                                  ? <Star className="h-4 w-4 fill-current" />
                                  : <Star className="h-4 w-4" />
                                }
                              </button>
                            </td>
                          </tr>
                        )})}
                      </tbody>
                    </table>

                    {displayedStocks.length === 0 && (
                      <div className="text-center py-16 px-6">
                        <p className="text-base font-bold mb-1">No results found</p>
                        <p className="text-xs text-muted-foreground mb-6">
                          We couldn't find any stocks matching your query.
                        </p>
                        <div className="flex flex-col items-center gap-3">
                          <p className="text-xs font-semibold text-muted-foreground">Try these alternative searches:</p>
                          <div className="flex flex-wrap justify-center gap-2">
                            <button 
                              onClick={() => {
                                setSearchInput("high dividend paying stocks");
                                handleSearch();
                              }}
                              className="px-3 py-1.5 bg-muted/60 hover:bg-muted rounded-full text-xs font-medium border border-border transition-colors"
                            >
                              "high dividend paying stocks"
                            </button>
                            <button 
                              onClick={() => {
                                setSearchInput("low risk cement sector");
                                handleSearch();
                              }}
                              className="px-3 py-1.5 bg-muted/60 hover:bg-muted rounded-full text-xs font-medium border border-border transition-colors"
                            >
                              "low risk cement sector"
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Filters & Information Sidebar (1/3 width) */}
          <div className="space-y-6">
             <Card className="shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
               <CardHeader className="pb-3 border-b border-border/40">
                 <CardTitle className="text-sm font-bold flex items-center justify-between">
                   <span>{language === "roman-urdu" ? "Screener Filters" : "Screener Filters"}</span>
                   {(shariaFilter || goalFilter !== "all" || riskFilter !== "all") && (
                     <button 
                       onClick={() => {
                         setShariaFilter(false);
                         setGoalFilter("all");
                         setRiskFilter("all");
                       }}
                       className="text-[10px] font-bold text-primary hover:underline"
                     >
                       {language === "roman-urdu" ? "Clear Karein" : "Clear All"}
                     </button>
                   )}
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-4 space-y-5">
                 {/* Shariah Filter */}
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                     {language === "roman-urdu" ? "Shariah Filter" : "Shariah Compliance"}
                   </label>
                   <ShariaToggle 
                     checked={shariaFilter} 
                     onToggle={(v) => {
                       setShariaFilter(v);
                       if (hasSearched) {
                         const result = nlpSearch(searchInput, v);
                         setSearchResult(result);
                       }
                     }} 
                   />
                 </div>

                 {/* Investment Goal Filter */}
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                     {language === "roman-urdu" ? "Investment Ka Maqsad" : "Investment Goal"}
                   </label>
                   <div className="grid grid-cols-2 gap-1.5">
                     <button
                       onClick={() => setGoalFilter("all")}
                       className={cn(
                         "py-2 px-2.5 text-left text-xs rounded-xl border font-semibold transition-all",
                         goalFilter === "all"
                           ? "bg-primary/10 border-primary text-primary"
                           : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                       )}
                     >
                       {language === "roman-urdu" ? "Sab Stocks" : "Show All"}
                     </button>
                     <button
                       onClick={() => setGoalFilter("income")}
                       className={cn(
                         "py-2 px-2.5 text-left text-xs rounded-xl border font-semibold transition-all flex items-center gap-1",
                         goalFilter === "income"
                           ? "bg-primary/10 border-primary text-primary"
                           : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                       )}
                     >
                       💵 {language === "roman-urdu" ? "Achi Kamai" : "Dividends"}
                     </button>
                     <button
                       onClick={() => setGoalFilter("growth")}
                       className={cn(
                         "py-2 px-2.5 text-left text-xs rounded-xl border font-semibold transition-all flex items-center gap-1",
                         goalFilter === "growth"
                           ? "bg-primary/10 border-primary text-primary"
                           : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                       )}
                     >
                       🚀 {language === "roman-urdu" ? "Barhne Wale" : "Growth"}
                     </button>
                     <button
                       onClick={() => setGoalFilter("safe")}
                       className={cn(
                         "py-2 px-2.5 text-left text-xs rounded-xl border font-semibold transition-all flex items-center gap-1",
                         goalFilter === "safe"
                           ? "bg-primary/10 border-primary text-primary"
                           : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                       )}
                     >
                       🛡️ {language === "roman-urdu" ? "Mehfooz" : "Safe & Stable"}
                     </button>
                   </div>
                 </div>

                 {/* Risk Level Filter */}
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                     {language === "roman-urdu" ? "Nuksan Ka Khatra" : "Risk Level"}
                   </label>
                   <div className="grid grid-cols-4 gap-1">
                     <button
                       onClick={() => setRiskFilter("all")}
                       className={cn(
                         "py-1.5 text-center text-[10px] rounded-lg border font-bold transition-all",
                         riskFilter === "all"
                           ? "bg-primary/10 border-primary text-primary"
                           : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                       )}
                     >
                       All
                     </button>
                     <button
                       onClick={() => setRiskFilter("low")}
                       className={cn(
                         "py-1.5 text-center text-[10px] rounded-lg border font-bold transition-all",
                         riskFilter === "low"
                           ? "bg-success/15 border-success/30 text-success"
                           : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                       )}
                     >
                       {language === "roman-urdu" ? "Kam" : "Low"}
                     </button>
                     <button
                       onClick={() => setRiskFilter("medium")}
                       className={cn(
                         "py-1.5 text-center text-[10px] rounded-lg border font-bold transition-all",
                         riskFilter === "medium"
                           ? "bg-warning/15 border-warning/30 text-warning"
                           : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                       )}
                     >
                       {language === "roman-urdu" ? "Med" : "Medium"}
                     </button>
                     <button
                       onClick={() => setRiskFilter("high")}
                       className={cn(
                         "py-1.5 text-center text-[10px] rounded-lg border font-bold transition-all",
                         riskFilter === "high"
                           ? "bg-destructive/15 border-destructive/30 text-destructive"
                           : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                       )}
                     >
                       {language === "roman-urdu" ? "Tez" : "High"}
                     </button>
                   </div>
                 </div>
               </CardContent>
             </Card>

            {/* Quick Searches */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                  {language === "roman-urdu" ? "Quick Talash" : "Quick Suggestions"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {quickSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSearchInput(s);
                        setLoading(true);
                        setQuery(s);
                        setTimeout(() => {
                          const result = nlpSearch(s, shariaFilter);
                          setSearchResult(result);
                          setHasSearched(true);
                          setLoading(false);
                        }, 600);
                      }}
                      className="px-3 py-1.5 text-xs rounded-full bg-primary/5 hover:bg-primary/10 text-primary border border-primary/15 transition-all text-left font-medium"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Screener Tips Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Screener Glossary</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3.5 text-xs">
                <div>
                  <p className="font-semibold text-foreground mb-0.5">📈 P/E Ratio</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Price-to-Earnings ratio. A higher P/E might mean high growth expectations, whereas a lower P/E indicates value or underpricing.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-0.5">☪️ Shariah Compliance</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Stocks screened for Islamic principles (e.g. debt levels &lt; 37%, liquid assets &gt; 25%, Halal primary business operations).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};