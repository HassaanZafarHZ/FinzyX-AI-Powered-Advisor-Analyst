import { useState, useEffect } from "react";
import { AppLayout } from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Calendar, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { psxStocks } from "../../data/psxStocks";
import { fetchPayouts } from "../../services/psxApi";

interface DividendEvent {
  symbol: string;
  name: string;
  exDate: string; // YYYY-MM-DD
  exDateObj: Date;
  amount: number;
  totalPayout: number;
  status: "confirmed" | "estimated";
}

const parseBookClosureToExDate = (bcStr: string | null): Date | null => {
  if (!bcStr) return null;
  const firstPart = bcStr.split("-")[0].trim();
  const match = firstPart.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);
    const date = new Date(year, month, day);
    // Ex-date is typically 1 day before book closure start
    date.setDate(date.getDate() - 1);
    return date;
  }
  const parsed = new Date(firstPart);
  if (!isNaN(parsed.getTime())) {
    parsed.setDate(parsed.getDate() - 1);
    return parsed;
  }
  return null;
};

const parseAmount = (divAnnouncementStr: string | null): number => {
  if (!divAnnouncementStr) return 0;
  const pctMatch = divAnnouncementStr.match(/(\d+(\.\d+)?)%/);
  if (pctMatch) {
    return parseFloat(pctMatch[1]) / 10;
  }
  const rsMatch = divAnnouncementStr.match(/(?:Rs\.?|PKR)\s*(\d+(\.\d+)?)/i);
  if (rsMatch) {
    return parseFloat(rsMatch[1]);
  }
  const numMatch = divAnnouncementStr.match(/(\d+(\.\d+)?)/);
  if (numMatch) {
    return parseFloat(numMatch[1]);
  }
  return 0;
};

export const Dividends = () => {
  const { holdings, language } = useApp();
  const [dividendEvents, setDividendEvents] = useState<DividendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(new Date("2026-07-14"));

  // Stable dependency string based on symbols and quantities
  const holdingsSummary = holdings.map(h => `${h.symbol}:${h.quantity}`).sort().join(',');

  useEffect(() => {
    let active = true;
    if (holdings.length === 0) {
      setLoading(false);
      setDividendEvents([]);
      return;
    }
    setLoading(true);

    Promise.all(
      holdings.map((h) =>
        fetchPayouts(h.symbol)
          .then((res) => {
            if (!res || !res.payouts) return [];
            return res.payouts.map((p) => {
              const exDate = parseBookClosureToExDate(p.book_closure_date);
              const amount = parseAmount(p.dividend_announcement);
              return {
                symbol: p.symbol,
                name: p.company || p.symbol,
                exDate: exDate ? `${exDate.getFullYear()}-${String(exDate.getMonth() + 1).padStart(2, "0")}-${String(exDate.getDate()).padStart(2, "0")}` : "",
                exDateObj: exDate,
                amount,
                totalPayout: amount * h.quantity,
                status: "confirmed" as const,
              };
            }).filter((e) => e.exDateObj !== null && e.exDate !== "");
          })
          .catch(() => [])
      )
    )
      .then((results) => {
        if (!active) return;
        const allEvents = results.flat() as DividendEvent[];
        // Sort by ex-date descending
        allEvents.sort((a, b) => b.exDateObj.getTime() - a.exDateObj.getTime());
        setDividendEvents(allEvents);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdingsSummary]);

  const today = new Date("2026-07-14");
  const ninetyDaysLater = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

  // Filter events within the next 90 days
  const upcomingEvents = dividendEvents.filter(
    (e) => e.exDateObj >= today && e.exDateObj <= ninetyDaysLater
  );

  // Filter events in the past
  const pastEvents = dividendEvents.filter((e) => e.exDateObj < today);

  const totalMonthlyIncome = dividendEvents
    .filter(
      (e) =>
        e.exDateObj.getMonth() === currentCalendarMonth.getMonth() &&
        e.exDateObj.getFullYear() === currentCalendarMonth.getFullYear()
    )
    .reduce((sum, e) => sum + e.totalPayout, 0);

  const upcomingCount = upcomingEvents.length;

  // Portfolio average dividend yield
  const avgYield = holdings.length > 0
    ? (holdings.reduce((sum, h) => {
        const stock = psxStocks.find((s) => s.symbol === h.symbol);
        return sum + (stock ? stock.divYield : 0);
      }, 0) / holdings.length).toFixed(1) + "%"
    : "0.0%";

  const handlePrevMonth = () => {
    setCurrentCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // Calendar calculations
  const calYear = currentCalendarMonth.getFullYear();
  const calMonth = currentCalendarMonth.getMonth();
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
  const numDays = new Date(calYear, calMonth + 1, 0).getDate();
  const monthName = currentCalendarMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <AppLayout>
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {language === "roman-urdu" ? "Dividend Calendar" : "Dividend Calendar"}
          </h1>
          <p className="text-muted-foreground">
            {language === "roman-urdu"
              ? "Apne holdings se aane wale dividend payments track karein."
              : "Track upcoming dividend payments from your holdings."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "roman-urdu"
                  ? `${currentCalendarMonth.toLocaleDateString(undefined, { month: "short" })} Dividend Aamdani`
                  : `${currentCalendarMonth.toLocaleDateString(undefined, { month: "short" })} Dividend Income`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                PKR {totalMonthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "roman-urdu"
                  ? "Chune huay mahiney ki payments"
                  : "For the selected calendar month"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "roman-urdu" ? "Aane Wale Payments" : "Upcoming Payments"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "roman-urdu"
                  ? "Holdings ke mutabiq agle 90 din mein"
                  : "For your holdings in next 90 days"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "roman-urdu" ? "Ausat Dividend Yield" : "Avg Dividend Yield"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgYield}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "roman-urdu" ? "Portfolio ki ausat yield" : "Portfolio average yield"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Split Layout: List on Left (2/3), Calendar & Insights on Right (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Calendar className="h-5 w-5 text-primary" />
                  {language === "roman-urdu"
                    ? "Holdings Ke Dividend Payments"
                    : "Your Holdings Dividend Payments"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground space-y-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent mx-auto" />
                    <p className="text-xs">Fetching dividend history from PSX...</p>
                  </div>
                ) : dividendEvents.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                      <Info className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">No Holdings Detected</p>
                      <p className="text-xs mt-1 leading-relaxed">
                        Add dividend-paying stocks to your portfolio to view expected payouts here.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-border/60">
                    {/* Upcoming Dividends Section */}
                    <div className="bg-muted/10 px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Upcoming (Next 90 Days)
                    </div>
                    {upcomingEvents.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground text-xs italic">
                        No upcoming dividends in the next 90 days
                      </div>
                    ) : (
                      upcomingEvents.map((dividend, idx) => (
                        <div
                          key={`upcoming-${dividend.symbol}-${idx}`}
                          className="flex items-center justify-between p-5 hover:bg-muted/10 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                              <h4 className="font-bold text-sm text-foreground">{dividend.symbol}</h4>
                              <Badge variant="success" className="text-[10px] font-semibold py-0.5">
                                Upcoming
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{dividend.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-extrabold text-base text-primary">
                              PKR {dividend.totalPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Per share: PKR {dividend.amount.toFixed(2)}
                            </p>
                            <p className="text-[10px] text-muted-foreground">Ex-date: {dividend.exDate}</p>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Historical / Past Dividends Section */}
                    {pastEvents.length > 0 && (
                      <>
                        <div className="bg-muted/10 px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Recent Payouts
                        </div>
                        {pastEvents.map((dividend, idx) => (
                          <div
                            key={`past-${dividend.symbol}-${idx}`}
                            className="flex items-center justify-between p-5 hover:bg-muted/10 transition-colors opacity-80"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                                <h4 className="font-bold text-sm text-foreground">{dividend.symbol}</h4>
                                <Badge variant="secondary" className="text-[10px] font-semibold py-0.5">
                                  Paid
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{dividend.name}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-extrabold text-base text-muted-foreground">
                                PKR {dividend.totalPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-1">
                                Per share: PKR {dividend.amount.toFixed(2)}
                              </p>
                              <p className="text-[10px] text-muted-foreground">Ex-date: {dividend.exDate}</p>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-6">
            {/* Calendar widget */}
            <Card className="shadow-sm">
              <CardHeader className="border-b border-border/40 pb-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold flex flex-col">
                  <span>{monthName}</span>
                  <span className="text-[9px] font-normal text-muted-foreground lowercase mt-0.5">Dividend Ex-Dates</span>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <span key={i} className="text-[10px] font-bold text-muted-foreground/80">{d}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: firstDayIndex + numDays }, (_, i) => {
                    const day = i - firstDayIndex + 1;
                    const isValid = day > 0;
                    
                    const dayEvents = isValid
                      ? dividendEvents.filter(
                          (e) =>
                            e.exDateObj.getFullYear() === calYear &&
                            e.exDateObj.getMonth() === calMonth &&
                            e.exDateObj.getDate() === day
                        )
                      : [];

                    return (
                      <div
                        key={i}
                        className={`aspect-square flex flex-col items-center justify-between p-1 rounded-md border relative ${
                          isValid
                            ? "border-border bg-card/50 hover:bg-muted/50 cursor-pointer"
                            : "border-transparent opacity-10 pointer-events-none"
                        }`}
                      >
                        {isValid && (
                          <>
                            <span className="text-[10px] font-bold self-start text-muted-foreground">{day}</span>
                            {dayEvents.length > 0 && (
                              <div className="flex flex-col gap-0.5 w-full items-center justify-center pb-0.5">
                                {dayEvents.map((evt, eidx) => (
                                  <span
                                    key={eidx}
                                    className="text-[8px] font-extrabold px-1 rounded bg-success/20 text-success border border-success/30 w-full text-center truncate scale-90"
                                    title={`${evt.symbol}: PKR ${evt.amount} dividend`}
                                  >
                                    {evt.symbol}
                                  </span>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Dividend Insights card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Dividend Glossary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs">
                <div>
                  <p className="font-semibold text-foreground mb-0.5">📅 Ex-Dividend Date</p>
                  <p className="text-muted-foreground leading-relaxed">
                    You must own the stock before this date to receive the upcoming dividend payout.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-0.5">📊 Dividend Yield</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Annual dividend payment divided by stock price, expressed as a percentage.
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
