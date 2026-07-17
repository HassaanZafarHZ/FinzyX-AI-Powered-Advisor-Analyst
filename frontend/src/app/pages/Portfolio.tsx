import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { Plus, TrendingUp, TrendingDown, Trash2, Edit2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { psxStocks } from "../../data/psxStocks";
import { useApp } from "../../contexts/AppContext";

// E4-US2-TC2: Check if PSX market is open (9:30 AM - 3:30 PM PKT)
const isMarketOpen = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  return currentTime >= marketOpen && currentTime < marketClose;
};

export const Portfolio = () => {
  const { holdings, dummyBalance } = useApp();
  const navigate = useNavigate();

  const totalValue = holdings.reduce((sum, h) => sum + h.currentPrice * h.quantity, 0);
  const totalInvested = holdings.reduce((sum, h) => sum + h.buyPrice * h.quantity, 0);
  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPercent = totalInvested ? ((totalGainLoss / totalInvested) * 100).toFixed(2) : "0.00";
  const marketOpen = isMarketOpen();

  const sectorAllocations = holdings.reduce((acc: { [key: string]: number }, h) => {
    const value = h.currentPrice * h.quantity;
    acc[h.sector] = (acc[h.sector] || 0) + value;
    return acc;
  }, {});

  const totalSectorValue = Object.values(sectorAllocations).reduce((sum, v) => sum + v, 0);

  const sectorList = Object.entries(sectorAllocations).map(([sector, value]) => ({
    sector,
    value,
    percentage: totalSectorValue ? ((value / totalSectorValue) * 100).toFixed(1) : "0"
  })).sort((a, b) => b.value - a.value);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Portfolio
              <Badge variant={marketOpen ? "success" : "secondary"} className="text-xs">
                {marketOpen ? "Market Open" : "Market Closed"}
              </Badge>
            </h1>
            <p className="text-muted-foreground">Track and manage your investment holdings in real-time.</p>
          </div>

        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Cash</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">PKR {dummyBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to invest</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">PKR {totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Based on current market prices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", totalGainLoss >= 0 ? "text-success" : "text-destructive")}>
                {totalGainLoss >= 0 ? "+" : ""}PKR {totalGainLoss.toLocaleString()}
              </div>
              <p className={cn("text-xs mt-1 flex items-center gap-1", totalGainLoss >= 0 ? "text-success" : "text-destructive")}>
                {totalGainLoss >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {totalGainLossPercent}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{holdings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Different stocks</p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Split Grid: Holdings Table (2/3) & Allocations (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
          {/* Left Column - Holdings Table (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle>Your Holdings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/20">
                        <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                        <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sector</th>
                        <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quantity</th>
                        <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Buy Price</th>
                        <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Invested</th>
                        <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Price</th>
                        <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">P/L Amount</th>
                        <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">P/L %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {holdings.length > 0 ? (
                        holdings.map((holding) => {
                          const plAmount = (holding.currentPrice - holding.buyPrice) * holding.quantity;
                          const plPercent = (((holding.currentPrice - holding.buyPrice) / holding.buyPrice) * 100).toFixed(2);

                          return (
                            <tr key={holding.symbol} className="hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/stock/${holding.symbol}`)}>
                              <td className="py-3.5 px-6">
                                <div>
                                  <div className="font-semibold text-sm text-foreground">{holding.symbol}</div>
                                  <div className="text-xs text-muted-foreground">{holding.name}</div>
                                </div>
                              </td>
                              <td className="py-3.5 px-6">
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">{holding.sector}</Badge>
                              </td>
                              <td className="py-3.5 px-6 text-right font-medium text-sm text-foreground">{holding.quantity}</td>
                              <td className="py-3.5 px-6 text-right font-medium text-sm text-foreground">PKR {holding.buyPrice}</td>
                              <td className="py-3.5 px-6 text-right font-semibold text-sm text-foreground">PKR {(holding.buyPrice * holding.quantity).toLocaleString()}</td>
                              <td className="py-3.5 px-6 text-right">
                                <div className="font-semibold text-sm text-foreground">PKR {holding.currentPrice}</div>
                                {!marketOpen && (
                                  <div className="text-[10px] text-muted-foreground">Last close price</div>
                                )}
                              </td>
                              <td className="py-3.5 px-6 text-right">
                                <span className={cn("text-sm font-bold", plAmount >= 0 ? "text-success" : "text-destructive")}>
                                  {plAmount >= 0 ? "+" : ""}PKR {Math.abs(plAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>
                              </td>
                              <td className="py-3.5 px-6 text-right">
                                <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full", Number(plPercent) >= 0 ? "text-success bg-success/10" : "text-destructive bg-destructive/10")}>
                                  {Number(plPercent) >= 0 ? "+" : ""}{plPercent}%
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-muted-foreground">
                            <p className="text-sm">You have no trades added yet.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sector Allocation & Portfolio Health (1/3 width) */}
          <div className="space-y-6">
            {/* Sector Allocation Card */}
            <Card className="shadow-sm">
              <CardHeader className="border-b border-border/40 pb-3">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>Sector Allocation</span>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Diversification</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {sectorList.length > 0 ? (
                  <div className="space-y-4">
                    {sectorList.map((item) => (
                      <div key={item.sector} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-foreground">{item.sector}</span>
                          <span className="text-muted-foreground">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-500" 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-muted-foreground text-right">
                          PKR {item.value.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    Add holdings to see your sector allocation.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Portfolio Health check card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Portfolio Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs">
                {holdings.length > 0 ? (
                  <>
                    <div>
                      <p className="font-semibold text-foreground mb-0.5">🟢 Diversification</p>
                      <p className="text-muted-foreground leading-relaxed">
                        {sectorList.length >= 3 
                          ? "Great job! Your portfolio is diversified across multiple sectors, reducing unsystematic risk."
                          : "Consider spreading your investments across 3 or more sectors to manage risk better."
                        }
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-0.5">📈 Gain/Loss Trend</p>
                      <p className="text-muted-foreground leading-relaxed">
                        {totalGainLoss >= 0 
                          ? "Your overall portfolio return is currently positive. Keep tracking market trends!"
                          : "Your portfolio is down. Look at stock fundamentals and Shariah compliance to decide on holds."
                        }
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    Once you add transactions to your holdings, you'll receive real-time diversification metrics and portfolio health tips.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};