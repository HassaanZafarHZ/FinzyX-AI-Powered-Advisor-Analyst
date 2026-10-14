import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { AppLayout } from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Send, Bot, User as UserIcon, Sparkles, Star, Info, ChevronRight, AlertTriangle, FileText } from "lucide-react";
import { cn } from "../../lib/utils";
import { useApp } from "../../contexts/AppContext";
import { psxStocks, nlpSearch, PSXStock } from "../../data/psxStocks";
import { fetchChatLogs, fetchLivePrices, saveChatLog, sendChatMessage, sendRahbarQuery } from "../../services/psxApi";


interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  stocks?: Array<{ symbol: string; name: string; price: number; change: number; divYield: number }>;
  sources?: Array<{ symbol: string; title: string }>;
  tickerValidation?: { valid: boolean; unverified_tickers: string[] };
  grounded?: boolean;
}

// ──────────────────────────────────────────────────────────────────────────────
// AI Response Engine
// ──────────────────────────────────────────────────────────────────────────────

const getStocksForQuery = (text: string) => {
  const words = text.toUpperCase().split(/[\s,.-]+/);
  return psxStocks.filter(s => words.includes(s.symbol)).slice(0, 5);
};

const romanUrduPatterns = [
  /\b(mujhe|mujy|mujhey|mujhay)\b/i,
  /\b(batao|bata do|dikha|dekhao|dikhao)\b/i,
  /\b(kya|kaisa|kaise|kyun|kb|kab)\b/i,
  /\b(stock|stocks)\b.*\b(dekhao|dikha|batao)\b/i,
  /\b(acha|achay|theek|thik)\b/i,
  /\b(sector|cement|banking|oil|gas|pharma|tech)\b.*\b(stock|batao|dekhao)\b/i,
  /\b(jo|hai|hain|ke|ka|ki)\b/i,
  /\b(zyada|kam|behtareen)\b/i,
  /\b(halal)\b/i,
];

const isRomanUrduQuery = (text: string): boolean => {
  return romanUrduPatterns.some((p) => p.test(text));
};

const isSimpleGreeting = (text: string): boolean => {
  return /^(hi|hello|hey|salam|assalam[- ]o[- ]alaikum|aoa|good morning|good afternoon|good evening)[!.?, ]*$/i.test(text.trim());
};

const isLivePriceQuery = (text: string): boolean => {
  return /\b(price|prices|qeemat|rate|rates|quote|current|live)\b/i.test(text) &&
    /\b(stock|stocks|share|shares|psx|market|mcb|hbl|ubl|ogdc|ppl|ffc|engro|lucky|luck)\b/i.test(text);
};

const isOldNoContextResponse = (text: string): boolean => {
  return /no context documents|no context documents loaded|do not have any context documents|provided context documents do not contain|no financial data or context|knowledge base.*context documents|currently do not contain any stock price/i.test(text);
};

// E6-US1-TC2: Detect mixed language queries
const detectLanguage = (text: string): "english" | "roman-urdu" | "mixed" => {
  const hasEnglish = /\b(show|me|stocks|dividend|banking|high|low)\b/i.test(text);
  const hasRomanUrdu = isRomanUrduQuery(text);
  if (hasEnglish && hasRomanUrdu) return "mixed";
  if (hasRomanUrdu) return "roman-urdu";
  return "english";
};

const detectIntent = (text: string) => {
  const t = text.toLowerCase();

  // Out of scope / Unanswerable queries - CHECK THIS FIRST!
  if (/\b(apple|tesla|amazon|google|microsoft|meta|nvidia|netflix|nyse|nasdaq|dow\s+jones|s&p|new\s+york\s+stock\s+exchange|wall\s+street)\b/i.test(text)) {
    return { type: "out_of_scope" };
  }

  // Specific stocks
  const stockMatch = psxStocks.find(
    (s) => t.includes(s.symbol.toLowerCase()) || t.includes(s.name.toLowerCase().split(" ")[0].toLowerCase())
  );
  if (stockMatch) return { type: "specific_stock", data: stockMatch };

  // Sector queries
  const sectorKeywords: Record<string, string> = {
    cement: "Cement", banking: "Banking", bank: "Banking",
    oil: "Oil & Gas", gas: "Oil & Gas", fertilizer: "Fertilizer",
    pharma: "Pharma", tech: "Technology", power: "Power", textile: "Textile",
    auto: "Automobile", automobile: "Automobile", food: "Food",
    steel: "Steel", chemical: "Chemicals",
  };
  for (const [kw, sector] of Object.entries(sectorKeywords)) {
    if (t.includes(kw)) return { type: "sector", data: sector };
  }

  // Intent keywords
  if (/dividend|income|passive/.test(t)) return { type: "dividend" };
  if (/shariah|halal|islamic|sharia/.test(t)) return { type: "shariah" };
  if (/low risk|kam risk|safe|mehfooz|conservative/.test(t)) return { type: "low_risk" };
  if (/best|top|acha|achi|recommended/.test(t)) return { type: "best" };
  if (/portfolio|allocation|roadmap|strategy/.test(t)) return { type: "portfolio" };
  if (/market|psx|overall|today/.test(t)) return { type: "market" };

  return { type: "general" };
};

const generateResponse = (
  userMsg: string,
  language: "english" | "roman-urdu",
  investorProfile: any
): { content: string; stocks?: any[] } => {
  const forceRomanUrdu = language === "roman-urdu" || isRomanUrduQuery(userMsg);
  const intent = detectIntent(userMsg);

  const getRisk = () => investorProfile?.riskAppetite || "moderate";

  if (intent.type === "out_of_scope") {
    if (forceRomanUrdu) {
      return {
        content: `🤖 **AI Rahbar — Sirf PSX Stocks**\n\nMaaf kijiye, main sirf Pakistan Stock Exchange (PSX) par listed companies ko cover karta hoon. Bara-e-meharbani apne sawal ko rephrase karein aur kisi Pakistani market company ke baray mein puchein (jaise ke 'ENGRO', 'MCB', ya 'LUCK').`
      };
    }
    return {
      content: `🤖 **AI Rahbar — PSX Stocks Only**\n\nI apologize, but I only cover stocks listed on the Pakistan Stock Exchange (PSX). Please rephrase your query to focus on a Pakistani market company (for example, 'ENGRO', 'MCB', or 'LUCK').`
    };
  }

  if (intent.type === "specific_stock") {
    const s = intent.data as any;
    if (forceRomanUrdu) {
      return {
        content: `📊 **${s.symbol} - ${s.name}**\n\n` +
          `💰 Qeemat: PKR ${s.price.toLocaleString()}\n` +
          `📈 Aaj Ka Tabadla: ${s.change > 0 ? "+" : ""}${s.change}%\n` +
          `💵 Dividend Yield: ${s.divYield}%\n` +
          `📉 P/E Ratio: ${s.pe}\n` +
          `☪️ Shariah: ${s.shariah ? "✅ Halal (Compliant)" : "❌ Non-Compliant"}\n` +
          `⚠️ Risk Level: ${s.riskLevel === "low" ? "Kam" : s.riskLevel === "high" ? "Zyada" : "Darmiyani"}\n\n` +
          `🤖 **AI Mashwara:** ${s.name} ek ${s.sector} company hai. ` +
          `${s.divYield > 8 ? "Iski dividend yield behtareen hai — income investors ke liye perfect hai." : "Yeh company stable returns deti hai."} ` +
          `${s.riskLevel === "low" ? "Yeh nisbatan safe investment hai." : s.riskLevel === "high" ? "Yeh high-risk investment hai, sirf tajurbekar investors ke liye." : "Yeh moderate risk investment hai."} ` +
          `${s.shariah ? "Shariah compliant hone ki wajah se yeh Muslim investors ke liye ideal hai." : ""}`,
        stocks: [s],
      };
    }
    return {
      content: `📊 **${s.symbol} - ${s.name}**\n\n` +
        `💰 Price: PKR ${s.price.toLocaleString()}\n` +
        `📈 Today's Change: ${s.change > 0 ? "+" : ""}${s.change}%\n` +
        `💵 Dividend Yield: ${s.divYield}%\n` +
        `📉 P/E Ratio: ${s.pe}\n` +
        `☪️ Shariah: ${s.shariah ? "✅ Compliant (Halal)" : "❌ Non-Compliant"}\n` +
        `⚠️ Risk Level: ${s.riskLevel.toUpperCase()}\n\n` +
        `🤖 **AI Analysis:** ${s.name} is a ${s.sector} company on PSX. ` +
        `${s.divYield > 8 ? "The high dividend yield makes it excellent for income-focused investors." : "It provides stable returns."} ` +
        `${s.riskLevel === "low" ? "It's considered a relatively safe investment." : s.riskLevel === "high" ? "It carries higher risk — suitable for experienced investors." : "Moderate risk, suitable for most investors."} ` +
        `${s.shariah ? "Being Shariah-compliant makes it ideal for Muslim investors." : ""}`,
      stocks: [s],
    };
  }

  if (intent.type === "sector") {
    const sector = intent.data as string;
    const sectorStocks = psxStocks.filter((s) => s.sector === sector).slice(0, 5);
    if (forceRomanUrdu) {
      return {
        content: `🏭 **${sector} Sector Ke Top Stocks**\n\n` +
          sectorStocks.map((s, i) => `${i + 1}. **${s.symbol}** (${s.name}) — PKR ${s.price} | Div: ${s.divYield}% | ${s.shariah ? "☪️ Halal" : "⚠️ Non-Halal"}`).join("\n") +
          `\n\n🤖 **AI Mashwara:** PSX par ${sector} sector ke ${sectorStocks.length} top stocks above dikhaye gaye hain. ` +
          `${sector === "Cement" ? "Pakistan mein construction boom ki wajah se cement sector profitable hai." : ""}` +
          `${sector === "Banking" ? "Banking sector mazboot hai aur interest rates zyada hone se profits barh rahe hain." : ""}` +
          `${sector === "Oil & Gas" ? "Oil & Gas sector high dividend deta hai aur government backed hai." : ""}` +
          ` In mein se kisi bhi stock par click kar ke detail dekh saktay hain.`,
        stocks: sectorStocks,
      };
    }
    return {
      content: `🏭 **Top ${sector} Stocks on PSX**\n\n` +
        sectorStocks.map((s, i) => `${i + 1}. **${s.symbol}** (${s.name}) — PKR ${s.price} | Div Yield: ${s.divYield}% | ${s.shariah ? "☪️ Shariah Compliant" : "⚠️ Non-Compliant"}`).join("\n") +
        `\n\n🤖 **AI Insight:** These are the top ${sector} sector stocks listed on PSX. ` +
        `${sector === "Cement" ? "Pakistan's construction boom is driving cement sector profitability." : ""}` +
        `${sector === "Banking" ? "Banking sector profits are rising due to high interest rate environment." : ""}` +
        `${sector === "Oil & Gas" ? "Oil & Gas stocks are known for high dividends and government backing." : ""}` +
        ` Click any stock in the Screener to view full details.`,
      stocks: sectorStocks,
    };
  }

  if (intent.type === "dividend") {
    const topDivStocks = [...psxStocks].sort((a, b) => b.divYield - a.divYield).slice(0, 5);
    if (forceRomanUrdu) {
      return {
        content: `💰 **PSX Ke Sabse Zyada Dividend Dene Wale Stocks**\n\n` +
          topDivStocks.map((s, i) => `${i + 1}. **${s.symbol}** — ${s.divYield}% yield | PKR ${s.price} | ${s.shariah ? "☪️ Halal" : "Non-Halal"}`).join("\n") +
          `\n\n🤖 **AI Mashwara:** Agar aap passive income chahte hain to yeh stocks behtareen hain. HUBC aur KAPCO sabse zyada dividend dete hain (14-15%). FFC aur OGDC bhi achi yield dete hain aur government backed hain.`,
        stocks: topDivStocks,
      };
    }
    return {
      content: `💰 **Highest Dividend Yield Stocks on PSX**\n\n` +
        topDivStocks.map((s, i) => `${i + 1}. **${s.symbol}** — ${s.divYield}% yield | PKR ${s.price} | ${s.shariah ? "☪️ Halal" : "Non-Compliant"}`).join("\n") +
        `\n\n🤖 **AI Insight:** For passive income investors, these are the top picks. HUBC and KAPCO offer 14-15% yields. FFC and OGDC are government-backed with consistently high dividends.`,
      stocks: topDivStocks,
    };
  }

  if (intent.type === "shariah") {
    const shariahStocks = psxStocks.filter((s) => s.shariah).slice(0, 6);
    if (forceRomanUrdu) {
      return {
        content: `☪️ **PSX Ke Shariah-Compliant (Halal) Stocks**\n\n` +
          shariahStocks.map((s, i) => `${i + 1}. **${s.symbol}** (${s.sector}) — PKR ${s.price} | Div: ${s.divYield}%`).join("\n") +
          `\n\n🤖 **AI Mashwara:** Yeh tamam stocks Shariah Supervisory Board ki taraf se approved hain. Meezan Bank (MEBL) aur MCB Islamic finance ke liye behtareen hain. Screener mein Shariah filter on kar ke tamam halal stocks dekh saktay hain.`,
        stocks: shariahStocks,
      };
    }
    return {
      content: `☪️ **Shariah-Compliant Stocks on PSX**\n\n` +
        shariahStocks.map((s, i) => `${i + 1}. **${s.symbol}** (${s.sector}) — PKR ${s.price} | Div: ${s.divYield}%`).join("\n") +
        `\n\n🤖 **AI Insight:** These stocks are approved by Shariah Supervisory Boards. Meezan Bank (MEBL) and MCB are excellent Islamic finance choices. Use the Shariah filter in the Screener to see all compliant stocks.`,
      stocks: shariahStocks,
    };
  }

  if (intent.type === "low_risk") {
    const safeStocks = psxStocks.filter((s) => s.riskLevel === "low").slice(0, 5);
    if (forceRomanUrdu) {
      return {
        content: `🛡️ **PSX Ke Sabse Kam Risk Wale Stocks**\n\n` +
          safeStocks.map((s, i) => `${i + 1}. **${s.symbol}** (${s.sector}) — Div: ${s.divYield}% | PE: ${s.pe}`).join("\n") +
          `\n\n🤖 **AI Mashwara:** Yeh blue-chip stocks hain jo PSX par sabse stable hain. Inka dividend track record behtareen hai aur government inko support karti hai. Beginners ke liye yeh best choice hai.`,
        stocks: safeStocks,
      };
    }
    return {
      content: `🛡️ **Low Risk, Stable PSX Stocks**\n\n` +
        safeStocks.map((s, i) => `${i + 1}. **${s.symbol}** (${s.sector}) — Div: ${s.divYield}% | PE: ${s.pe}`).join("\n") +
        `\n\n🤖 **AI Insight:** These are blue-chip PSX stocks with the lowest volatility. They have excellent dividend track records and are often government-backed. Perfect for conservative investors and beginners.`,
      stocks: safeStocks,
    };
  }

  if (intent.type === "market") {
    if (forceRomanUrdu) {
      return {
        content: `📊 **PSX Market Ka Aaj Ka Jaiza**\n\n` +
          `📈 KSE-100 Index: 75,420 (+1.2%)\n` +
          `💹 Total Volume: 850M shares\n` +
          `📊 Market Cap: PKR 10.2 Trillion\n\n` +
          `🔥 **Aaj Ke Top Gainers:**\n` +
          `• TRG +8.5% | SYS +5.2% | SAZGAR +4.5%\n\n` +
          `❄️ **Top Losers:**\n` +
          `• HASCOL -2.5% | KEL -1.8%\n\n` +
          `🤖 **AI Mashwara:** Aaj market overall positive hai. Technology aur Automobile sector mein tezi hai. Banking stocks stable hain.`,
      };
    }
    return {
      content: `📊 **PSX Market Overview — Today**\n\n` +
        `📈 KSE-100 Index: 75,420 (+1.2%)\n` +
        `💹 Total Volume: 850M shares\n` +
        `📊 Market Cap: PKR 10.2 Trillion\n\n` +
        `🔥 **Top Gainers Today:**\n` +
        `• TRG +8.5% | SYS +5.2% | SAZGAR +4.5%\n\n` +
        `❄️ **Top Losers:**\n` +
        `• HASCOL -2.5% | KEL -1.8%\n\n` +
        `🤖 **AI Insight:** Market is bullish today. Technology and Automobile sectors leading gains. Banking stocks remain stable.`,
    };
  }

  if (intent.type === "portfolio") {
    const risk = getRisk();
    if (forceRomanUrdu) {
      return {
        content: `📋 **Aapka ${risk === "conservative" ? "Mehfooz" : risk === "moderate" ? "Darmiyani" : "Jadid"} Portfolio Suggestion**\n\n` +
          `${risk === "conservative"
            ? "• 30% Banking (MCB, MEBL, HBL)\n• 40% Fertilizer (FFC, EFERT)\n• 20% Power (HUBC, KAPCO)\n• 10% Cash"
            : risk === "moderate"
            ? "• 40% Banking (MCB, UBL, ABL)\n• 20% Cement (LUCK, KOHC)\n• 20% Energy (OGDC, PPL)\n• 20% Tech (SYS)"
            : "• 30% Technology (TRG, SYS)\n• 25% Automobile (SAZGAR, MTL)\n• 25% Chemicals (ENGRO, ICI)\n• 20% High-risk growth"
          }\n\n🤖 **AI Mashwara:** Yeh allocation aapke ${risk} risk profile ke liye best hai. Diversification se risk kam hota hai.`,
      };
    }
    return {
      content: `📋 **Portfolio Allocation for ${risk.charAt(0).toUpperCase() + risk.slice(1)} Risk Profile**\n\n` +
        `${risk === "conservative"
          ? "• 30% Banking (MCB, MEBL, HBL)\n• 40% Fertilizer (FFC, EFERT)\n• 20% Power (HUBC, KAPCO)\n• 10% Cash"
          : risk === "moderate"
          ? "• 40% Banking (MCB, UBL, ABL)\n• 20% Cement (LUCK, KOHC)\n• 20% Energy (OGDC, PPL)\n• 20% Tech (SYS)"
          : "• 30% Technology (TRG, SYS)\n• 25% Automobile (SAZGAR, MTL)\n• 25% Chemicals (ENGRO, ICI)\n• 20% High-risk growth stocks"
        }\n\n🤖 **AI Insight:** This allocation is optimized for your ${risk} risk profile. Diversification across sectors reduces overall portfolio risk.`,
    };
  }

  // General fallback
  if (forceRomanUrdu) {
    return {
      content: `🤖 **AI Rahbar — Main Samjha!**\n\n` +
        `Main aapki madad karna chahta hoon. Aap mujhse puch saktay hain:\n\n` +
        `• Kisi bhi PSX stock ke baray mein (e.g., "MCB kaise hai?")\n` +
        `• Sector ke stocks (e.g., "cement stocks dekhao")\n` +
        `• High dividend stocks ("zyada dividend wale stocks batao")\n` +
        `• Shariah compliant stocks ("halal stocks")\n` +
        `• Low risk stocks ("mehfooz stocks")\n` +
        `• Market update ("market ka haal batao")\n\n` +
        `Main aapko personalized PSX investment mashware deta hoon! 💪`,
    };
  }
  return {
    content: `🤖 **AI Rahbar at your service!**\n\n` +
      `I can help you with:\n\n` +
      `• Analysis of any PSX stock (e.g., "Tell me about MCB")\n` +
      `• Sector stocks (e.g., "cement stocks", "banking sector")\n` +
      `• High dividend picks ("high dividend stocks")\n` +
      `• Shariah compliant stocks ("halal stocks")\n` +
      `• Low risk investments ("safe stocks")\n` +
      `• Market overview ("how is PSX today?")\n` +
      `• Portfolio advice ("what should I buy?")\n\n` +
      `Ask me anything about PSX investing! 📊`,
  };
};



// ──────────────────────────────────────────────────────────────────────────────

// Component
// ──────────────────────────────────────────────────────────────────────────────

export const AIRahbar = () => {
  const navigate = useNavigate();
  const { language, investorProfile, profileComplete } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getInitialMsg = (): Message => ({
    id: 1,
    role: "assistant",
    content: language === "roman-urdu"
      ? "Assalam-o-Alaikum! Main aapka AI financial advisor hoon. PSX stocks, Shariah compliance, ya apne investment roadmap ke baray mein kuch bhi puchein. Main Roman Urdu ya English dono mein jawab deta hoon! 🤖"
      : "Assalam-o-Alaikum! I'm your AI Rahbar — your intelligent PSX investment advisor. Ask me about stocks, Shariah compliance, dividends, or your personalized roadmap. You can also type in Roman Urdu! 🤖",
  });

  const [messages, setMessages] = useState<Message[]>([getInitialMsg()]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [detectedLang, setDetectedLang] = useState<"english" | "roman-urdu" | "mixed" | null>(null);

  // Block access if profile is incomplete (E2-US1-TC2)
  if (!profileComplete) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    {language === "roman-urdu"
                      ? "Profile Mukammal Karein"
                      : "Complete Your Profile First"}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {language === "roman-urdu"
                      ? "AI Rahbar roadmap generate karne se pehle apna investor profile complete karein. Humein aapki umar, monthly income, aur risk appetite ki zaroorat hai."
                      : "Before the AI Rahbar can generate your investment roadmap, please complete your investor profile. We need your age, monthly income, and risk appetite to provide personalized recommendations."}
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/dashboard")}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  {language === "roman-urdu" ? "Profile Complete Karein" : "Complete Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const logs = await fetchChatLogs();
        if (logs && logs.length > 0) {
          const historicalMessages: Message[] = [getInitialMsg()];
          logs.forEach((entry, index) => {
            if (isOldNoContextResponse(entry.response)) return;
            historicalMessages.push({
              id: index * 2 + 2,
              role: "user",
              content: entry.query,
            });
            historicalMessages.push({
              id: index * 2 + 3,
              role: "assistant",
              content: entry.response,
              stocks: getStocksForQuery(entry.query),
            });
          });
          setMessages(historicalMessages);
        }
      } catch (err) {
        console.error("Failed to load chat logs:", err);
      }
    };
    if (profileComplete) {
      loadLogs();
    }
  }, [profileComplete, language]);


  const suggestions = language === "roman-urdu"
    ? [
        "mujhe cement stocks dekhao",
        "zyada dividend wale stocks",
        "MCB kaisa hai?",
        "halal stocks batao",
        "kam risk wale stocks",
        "market ka haal batao",
      ]
    : [
        "Show me cement sector stocks",
        "High dividend PSX stocks",
        "Analyze MCB Bank",
        "Best Shariah compliant stocks",
        "Low risk safe investments",
        "Portfolio advice for me",
      ];

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    // E6-US1-TC2: Detect language
    const detected = detectLanguage(msg);
    setDetectedLang(detected);

    setMessages((prev) => {
      const userMessage: Message = {
        id: prev.length + 1,
        role: "user",
        content: msg,
      };
      return [...prev, userMessage];
    });
    setInput("");
    setIsTyping(true);

    // Prepare history for API
    const historyForApi = messages.map(m => ({
      role: m.role,
      content: m.content
    })).concat([{ role: 'user', content: msg }]);

    // API Call
    setTimeout(async () => {
      try {
        // If user explicitly selected Roman Urdu in app settings, force that.
        // Otherwise let the backend auto-detect from the query text.
        const apiLang = language === "roman-urdu" ? "roman_urdu" : "auto";
        const response = isSimpleGreeting(msg) || isLivePriceQuery(msg)
          ? null
          : await sendRahbarQuery(msg, apiLang);
        let replyContent = isSimpleGreeting(msg)
          ? (language === "roman-urdu"
            ? "Wa Alaikum Assalam! Main AI Rahbar hoon. PSX stocks, dividends, halal stocks ya kisi company ke baray mein sawal pooch sakte hain."
            : "Wa Alaikum Assalam! I am AI Rahbar. Ask me about PSX stocks, dividends, Shariah-compliant stocks, or any company.")
          : response?.answer || "I'm sorry, I'm having trouble connecting to my servers right now. Please try again later.";

        if (isLivePriceQuery(msg)) {
          const requestedSymbols = psxStocks
            .filter((stock) => new RegExp(`\\b${stock.symbol}\\b`, "i").test(msg))
            .map((stock) => stock.symbol);
          const symbols = requestedSymbols.length > 0 ? requestedSymbols : ["MCB", "HBL", "OGDC", "FFC", "LUCK"];
          const livePrices = await fetchLivePrices(symbols);
          if (livePrices.length > 0) {
            replyContent = (language === "roman-urdu" ? "📈 **Live PSX Qeematein**\n\n" : "📈 **Live PSX Prices**\n\n") +
              livePrices.map((price) => `${price.symbol}: PKR ${price.current_price.toLocaleString()} (${price.change_percent == null ? "N/A" : `${price.change_percent >= 0 ? "+" : ""}${price.change_percent}%`})`).join("\n");
          } else {
            replyContent = language === "roman-urdu"
              ? "PSX live prices is waqt available nahi hain. Stock Screener se dobara check karein."
              : "PSX live prices are temporarily unavailable. Please check the Stock Screener again.";
          }
        } else if (response && response.grounded === false) {
          const localFallback = generateResponse(msg, language, investorProfile);
          replyContent = localFallback.content;
        }

        setMessages((prev) => {
          const assistantMessage: Message = {
            id: prev.length + 1,
            role: "assistant",
            content: replyContent,
            stocks: getStocksForQuery(replyContent), // Try to extract stocks from response
            sources: response?.sources,
            tickerValidation: response?.ticker_validation,
            grounded: response?.grounded
          };
          return [...prev, assistantMessage];
        });

        // Save to database
        try {
          await saveChatLog(msg, replyContent, apiLang);
        } catch (err) {
          console.error("Failed to save chat log to database:", err);
        }
      } catch (error) {
        console.error("API Error:", error);
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, role: "assistant", content: "Sorry, I encountered an error. Please ensure the GEMINI_API_KEY is configured in the backend." }
        ]);
      } finally {
        setIsTyping(false);
      }
    }, 100);
  };


  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="font-bold">{line.replace(/\*\*/g, "")}</p>;
      }
      if (line.includes("**")) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i}>
            {parts.map((part, j) => (j % 2 === 1 ? <strong key={j}>{part}</strong> : part))}
          </p>
        );
      }
      if (line === "") return <br key={i} />;
      return <p key={i}>{line}</p>;
    });
  };

  return (
    <AppLayout>
      <div className="w-full flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2 animate-in fade-in duration-300">
            <Bot className="h-7 w-7 text-primary animate-pulse" />
            AI Rahbar
          </h1>
          <p className="text-muted-foreground text-sm">
            {language === "roman-urdu"
              ? "Aapka zeheen PSX investment advisor — Roman Urdu ya English mein baat karein"
              : "Your intelligent PSX financial advisor — chat in English or Roman Urdu"}
          </p>
        </div>

        {/* 2-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
          {/* Left Column (2/3 width) - The Chat Box */}
          <div className="lg:col-span-2 flex flex-col h-[calc(100vh-210px)] min-h-[520px]">
            <Card className="flex-1 flex flex-col overflow-hidden shadow-sm h-full">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[80%] rounded-xl p-4 space-y-1",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <div className="text-sm leading-relaxed space-y-1">
                        {message.role === "assistant"
                          ? formatMessage(message.content)
                          : <p>{message.content}</p>
                        }
                      </div>

                      {/* Linked Stocks */}
                      {message.stocks && message.stocks.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
                          <p className="text-xs text-muted-foreground font-medium">
                            {language === "roman-urdu" ? "Detail Dekhen:" : "View Details:"}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {message.stocks.map((s) => (
                              <button
                                key={s.symbol}
                                onClick={() => navigate(`/stock/${s.symbol}`)}
                                className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition-colors border border-primary/20"
                              >
                                📊 {s.symbol} →
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sources (Grounding Proof) */}
                      {message.grounded !== false && message.sources && message.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <FileText className="w-3.5 h-3.5" />
                            {language === "roman-urdu" ? "Zaraye (Sources):" : "Sources:"}
                          </div>
                          <ul className="space-y-1">
                            {message.sources.map((src, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                                <span className="text-primary font-medium shrink-0">{src.symbol}</span>
                                <span className="truncate" title={src.title}>— {src.title}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Ticker Validation Warning */}
                      {message.tickerValidation && !message.tickerValidation.valid && (
                        <div className="mt-2 flex items-center gap-2 p-2 bg-amber-500/10 text-amber-600 rounded-lg text-xs">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <p>
                            <strong>Unverified tickers mentioned:</strong>{" "}
                            {message.tickerValidation.unverified_tickers.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>

                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                        <UserIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-border p-4 space-y-3">
                {/* E6-US1-TC2: Language Detection Badge */}
                {detectedLang && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">
                      {detectedLang === "mixed"
                        ? "🌐 Detected: English + Roman Urdu"
                        : detectedLang === "roman-urdu"
                        ? "🇵🇰 Detected: Roman Urdu"
                        : "🇬🇧 Detected: English"}
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder={
                      language === "roman-urdu"
                        ? "Kuch bhi puchein... (e.g., 'mujhe cement stocks dekhao')"
                        : "Ask anything... (e.g., 'show me cement stocks')"
                    }
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button onClick={() => handleSend()} size="default" disabled={isTyping || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column (1/3 width) - Sidebar Info & Suggestions */}
          <div className="space-y-6">
            {/* Quick Suggestions Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>{language === "roman-urdu" ? "Tajaweez" : "Quick Suggestions"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      className="w-full text-left px-4 py-2.5 text-xs rounded-xl bg-card border border-border/60 hover:border-primary/45 hover:bg-primary/5 transition-all text-foreground font-medium flex items-center justify-between group"
                    >
                      <span>{s}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Advisor Tips Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-2">
                  <Info className="h-3.5 w-3.5 text-primary" />
                  <span>{language === "roman-urdu" ? "Advisor Hidayat" : "AI Advisor Tips"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div>
                  <p className="font-semibold text-foreground mb-1">🗣️ Language Detection</p>
                  <p className="text-muted-foreground leading-relaxed">
                    AI Rahbar automatically detects whether you speak in Roman Urdu or English and replies in the same language context.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">☪️ Halal/Shariah Stocks</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Ask for "halal stocks" or "Shariah compliant list" to see stocks that meet Islamic screening principles.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">🎯 Profile Synchronization</p>
                  <p className="text-muted-foreground leading-relaxed">
                    The advisor tailors all asset allocation suggestions based on your Risk Appetite profile.
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
