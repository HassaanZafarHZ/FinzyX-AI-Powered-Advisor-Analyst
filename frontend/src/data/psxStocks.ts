export interface PSXStock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  divYield: number;
  pe: number;
  shariah: boolean;
  marketCap: string;
  volume: string;
  high52w: number;
  low52w: number;
  description: string;
  riskLevel: "low" | "medium" | "high";
}

export const psxStocks: PSXStock[] = [
  // ── BANKING ──────────────────────────────────────────────────────────────
  { symbol: "MCB", name: "MCB Bank Ltd", sector: "Banking", price: 245.50, change: 2.5, divYield: 8.5, pe: 6.2, shariah: true, marketCap: "PKR 287B", volume: "2.5M", high52w: 258, low52w: 210, description: "One of Pakistan's largest private sector banks with consistent dividend history.", riskLevel: "low" },
  { symbol: "HBL", name: "Habib Bank Ltd", sector: "Banking", price: 156.30, change: 1.8, divYield: 7.2, pe: 5.8, shariah: true, marketCap: "PKR 240B", volume: "3.1M", high52w: 175, low52w: 130, description: "Pakistan's largest bank by assets, strong retail and corporate banking.", riskLevel: "low" },
  { symbol: "UBL", name: "United Bank Ltd", sector: "Banking", price: 178.90, change: -0.5, divYield: 9.1, pe: 5.4, shariah: false, marketCap: "PKR 145B", volume: "1.8M", high52w: 200, low52w: 155, description: "Major commercial bank with wide branch network.", riskLevel: "low" },
  { symbol: "ABL", name: "Allied Bank Ltd", sector: "Banking", price: 132.40, change: 1.2, divYield: 8.8, pe: 5.0, shariah: true, marketCap: "PKR 118B", volume: "1.2M", high52w: 148, low52w: 110, description: "Strong growth bank with good capital adequacy ratios.", riskLevel: "low" },
  { symbol: "BAHL", name: "Bank AL Habib Ltd", sector: "Banking", price: 89.60, change: 0.9, divYield: 7.5, pe: 6.8, shariah: true, marketCap: "PKR 78B", volume: "0.9M", high52w: 98, low52w: 72, description: "Mid-size bank with consistent performance.", riskLevel: "low" },
  { symbol: "BAFL", name: "Bank Alfalah Ltd", sector: "Banking", price: 45.20, change: 1.5, divYield: 6.9, pe: 7.2, shariah: true, marketCap: "PKR 57B", volume: "2.4M", high52w: 52, low52w: 36, description: "Growing retail bank with digital banking focus.", riskLevel: "medium" },
  { symbol: "MEBL", name: "Meezan Bank Ltd", sector: "Banking", price: 198.30, change: 3.1, divYield: 6.2, pe: 9.5, shariah: true, marketCap: "PKR 283B", volume: "4.2M", high52w: 220, low52w: 155, description: "Pakistan's leading Islamic bank, fully Shariah-compliant operations.", riskLevel: "low" },
  { symbol: "AKBL", name: "Askari Bank Ltd", sector: "Banking", price: 28.50, change: -1.1, divYield: 5.5, pe: 5.5, shariah: false, marketCap: "PKR 37B", volume: "0.7M", high52w: 35, low52w: 22, description: "Army-linked bank with growing network.", riskLevel: "medium" },
  { symbol: "BOP", name: "Bank of Punjab", sector: "Banking", price: 14.80, change: 2.0, divYield: 4.5, pe: 8.0, shariah: false, marketCap: "PKR 22B", volume: "1.5M", high52w: 18, low52w: 11, description: "Provincial bank with wide Punjab coverage.", riskLevel: "medium" },
  { symbol: "JSBL", name: "JS Bank Ltd", sector: "Banking", price: 9.60, change: 0.5, divYield: 3.2, pe: 10.2, shariah: false, marketCap: "PKR 14B", volume: "0.8M", high52w: 12, low52w: 7.5, description: "Growing mid-size bank with JS Group backing.", riskLevel: "high" },

  // ── CEMENT ───────────────────────────────────────────────────────────────
  { symbol: "LUCK", name: "Lucky Cement Ltd", sector: "Cement", price: 612.50, change: 3.2, divYield: 5.5, pe: 9.2, shariah: true, marketCap: "PKR 201B", volume: "0.5M", high52w: 680, low52w: 520, description: "Pakistan's largest cement producer with exports.", riskLevel: "medium" },
  { symbol: "DGKC", name: "DG Khan Cement", sector: "Cement", price: 98.40, change: 1.5, divYield: 4.8, pe: 7.5, shariah: true, marketCap: "PKR 38B", volume: "0.6M", high52w: 115, low52w: 78, description: "Major cement producer with diversified operations.", riskLevel: "medium" },
  { symbol: "MLCF", name: "Maple Leaf Cement", sector: "Cement", price: 35.60, change: -0.8, divYield: 3.5, pe: 8.2, shariah: true, marketCap: "PKR 18B", volume: "0.8M", high52w: 45, low52w: 28, description: "Mid-size cement producer with improving efficiency.", riskLevel: "medium" },
  { symbol: "CHCC", name: "Cherat Cement", sector: "Cement", price: 115.20, change: 2.1, divYield: 6.0, pe: 6.8, shariah: true, marketCap: "PKR 22B", volume: "0.3M", high52w: 135, low52w: 90, description: "Efficient cement producer with good dividend history.", riskLevel: "medium" },
  { symbol: "FCCL", name: "Fauji Cement", sector: "Cement", price: 22.40, change: 0.7, divYield: 4.2, pe: 9.0, shariah: true, marketCap: "PKR 26B", volume: "1.2M", high52w: 28, low52w: 17, description: "Fauji Group's cement venture with military support.", riskLevel: "medium" },
  { symbol: "PIOC", name: "Pioneer Cement", sector: "Cement", price: 82.30, change: 1.8, divYield: 5.8, pe: 7.2, shariah: true, marketCap: "PKR 17B", volume: "0.4M", high52w: 98, low52w: 65, description: "Established cement maker with expanding capacity.", riskLevel: "medium" },
  { symbol: "KOHC", name: "Kohat Cement", sector: "Cement", price: 142.60, change: 2.5, divYield: 7.0, pe: 6.5, shariah: true, marketCap: "PKR 29B", volume: "0.3M", high52w: 165, low52w: 110, description: "High dividend cement company with strong cash flows.", riskLevel: "low" },
  { symbol: "ACPL", name: "Attock Cement", sector: "Cement", price: 186.20, change: 1.2, divYield: 5.2, pe: 8.0, shariah: true, marketCap: "PKR 24B", volume: "0.2M", high52w: 210, low52w: 155, description: "Quality cement producer in KPK region.", riskLevel: "medium" },
  { symbol: "GHNL", name: "Gharibwal Cement", sector: "Cement", price: 28.90, change: -0.5, divYield: 2.8, pe: 12.0, shariah: true, marketCap: "PKR 10B", volume: "0.5M", high52w: 38, low52w: 22, description: "Smaller cement producer with growth potential.", riskLevel: "high" },

  // ── OIL & GAS ────────────────────────────────────────────────────────────
  { symbol: "OGDC", name: "Oil & Gas Dev Corp", sector: "Oil & Gas", price: 156.20, change: -1.2, divYield: 12.3, pe: 4.5, shariah: true, marketCap: "PKR 672B", volume: "3.8M", high52w: 180, low52w: 130, description: "State-owned E&P giant, highest dividend payer in PSX.", riskLevel: "low" },
  { symbol: "PPL", name: "Pakistan Petroleum Ltd", sector: "Oil & Gas", price: 128.40, change: -0.8, divYield: 10.5, pe: 4.2, shariah: true, marketCap: "PKR 196B", volume: "2.1M", high52w: 148, low52w: 105, description: "Major gas exploration company with strong reserves.", riskLevel: "low" },
  { symbol: "POL", name: "Pakistan Oilfields Ltd", sector: "Oil & Gas", price: 498.60, change: 1.5, divYield: 9.8, pe: 5.8, shariah: true, marketCap: "PKR 78B", volume: "0.3M", high52w: 540, low52w: 420, description: "Attock Group's E&P company with high dividends.", riskLevel: "low" },
  { symbol: "MARI", name: "Mari Petroleum", sector: "Oil & Gas", price: 1845.00, change: 2.0, divYield: 5.2, pe: 7.5, shariah: true, marketCap: "PKR 198B", volume: "0.1M", high52w: 2100, low52w: 1600, description: "Largest gas field operator in Pakistan.", riskLevel: "low" },
  { symbol: "PSO", name: "Pakistan State Oil", sector: "Oil & Gas", price: 178.40, change: 1.5, divYield: 6.8, pe: 7.1, shariah: false, marketCap: "PKR 47B", volume: "0.8M", high52w: 210, low52w: 145, description: "Dominant oil marketing company in Pakistan.", riskLevel: "medium" },
  { symbol: "APL", name: "Attock Petroleum Ltd", sector: "Oil & Gas", price: 425.80, change: 0.9, divYield: 8.5, pe: 6.2, shariah: true, marketCap: "PKR 34B", volume: "0.2M", high52w: 480, low52w: 360, description: "Private OMC with strong dividend track record.", riskLevel: "low" },
  { symbol: "HASCOL", name: "Hascol Petroleum", sector: "Oil & Gas", price: 22.40, change: -2.5, divYield: 0.0, pe: 0.0, shariah: false, marketCap: "PKR 4B", volume: "0.5M", high52w: 35, low52w: 15, description: "OMC undergoing restructuring after debt issues.", riskLevel: "high" },
  { symbol: "ATRL", name: "Attock Refinery Ltd", sector: "Oil & Gas", price: 312.50, change: 1.8, divYield: 7.2, pe: 5.5, shariah: true, marketCap: "PKR 26B", volume: "0.2M", high52w: 350, low52w: 260, description: "Refinery with consistent operations and dividends.", riskLevel: "medium" },
  { symbol: "NRL", name: "National Refinery Ltd", sector: "Oil & Gas", price: 745.20, change: 0.5, divYield: 6.5, pe: 6.8, shariah: true, marketCap: "PKR 55B", volume: "0.1M", high52w: 820, low52w: 640, description: "State-backed refinery with stable operations.", riskLevel: "low" },

  // ── FERTILIZER / CHEMICALS ───────────────────────────────────────────────
  { symbol: "ENGRO", name: "Engro Corporation", sector: "Chemicals", price: 289.75, change: 0.8, divYield: 7.2, pe: 8.5, shariah: true, marketCap: "PKR 156B", volume: "1.2M", high52w: 320, low52w: 240, description: "Conglomerate with diversified interests in energy and fertilizers.", riskLevel: "medium" },
  { symbol: "FFC", name: "Fauji Fertilizer Co", sector: "Fertilizer", price: 128.60, change: 1.2, divYield: 11.5, pe: 5.2, shariah: true, marketCap: "PKR 155B", volume: "1.5M", high52w: 148, low52w: 105, description: "Pakistan's largest fertilizer company with highest dividends.", riskLevel: "low" },
  { symbol: "EFERT", name: "Engro Fertilizers", sector: "Fertilizer", price: 92.40, change: 0.5, divYield: 9.8, pe: 5.5, shariah: true, marketCap: "PKR 140B", volume: "2.0M", high52w: 108, low52w: 75, description: "Major urea producer with consistent dividend payouts.", riskLevel: "low" },
  { symbol: "FFBL", name: "Fauji Fertilizer Bin Qasim", sector: "Fertilizer", price: 35.20, change: -0.5, divYield: 6.5, pe: 9.0, shariah: true, marketCap: "PKR 42B", volume: "0.8M", high52w: 42, low52w: 28, description: "DAP fertilizer producer in Port Qasim.", riskLevel: "medium" },
  { symbol: "FATIMA", name: "Fatima Fertilizer", sector: "Fertilizer", price: 42.80, change: 1.5, divYield: 8.5, pe: 5.8, shariah: true, marketCap: "PKR 52B", volume: "1.1M", high52w: 50, low52w: 34, description: "Growing fertilizer company with diversified product range.", riskLevel: "medium" },
  { symbol: "ICI", name: "ICI Pakistan Ltd", sector: "Chemicals", price: 685.40, change: 2.2, divYield: 4.5, pe: 12.5, shariah: true, marketCap: "PKR 82B", volume: "0.1M", high52w: 780, low52w: 580, description: "Specialty chemicals and paint manufacturer.", riskLevel: "medium" },
  { symbol: "EPCL", name: "Engro Polymer & Chem", sector: "Chemicals", price: 58.60, change: 1.8, divYield: 7.8, pe: 6.5, shariah: true, marketCap: "PKR 44B", volume: "0.6M", high52w: 68, low52w: 46, description: "PVC resin manufacturer with growing revenues.", riskLevel: "medium" },
  { symbol: "LOTCHEM", name: "Lotte Chemical Pakistan", sector: "Chemicals", price: 24.80, change: -1.0, divYield: 5.0, pe: 8.8, shariah: false, marketCap: "PKR 18B", volume: "0.5M", high52w: 32, low52w: 18, description: "PTA manufacturer for textile industry.", riskLevel: "medium" },

  // ── AUTOMOBILE ───────────────────────────────────────────────────────────
  { symbol: "SAZEW", name: "Sazgar Engineering Works", sector: "Automobile", price: 285.40, change: 4.5, divYield: 6.8, pe: 8.2, shariah: true, marketCap: "PKR 22B", volume: "0.8M", high52w: 340, low52w: 210, description: "Leading rickshaw and electric vehicle manufacturer in Pakistan.", riskLevel: "medium" },
  { symbol: "HCAR", name: "Honda Atlas Cars", sector: "Automobile", price: 215.60, change: -1.5, divYield: 3.5, pe: 15.2, shariah: true, marketCap: "PKR 17B", volume: "0.3M", high52w: 260, low52w: 170, description: "Honda's Pakistan venture for car assembly.", riskLevel: "medium" },
  { symbol: "INDU", name: "Indus Motor Co", sector: "Automobile", price: 1485.00, change: 2.8, divYield: 5.2, pe: 12.5, shariah: true, marketCap: "PKR 74B", volume: "0.05M", high52w: 1750, low52w: 1200, description: "Toyota vehicles assembler in Pakistan.", riskLevel: "medium" },
  { symbol: "PSMC", name: "Pak Suzuki Motor", sector: "Automobile", price: 658.20, change: 1.5, divYield: 2.5, pe: 18.0, shariah: true, marketCap: "PKR 50B", volume: "0.1M", high52w: 780, low52w: 520, description: "Suzuki's Pakistan operations for small cars.", riskLevel: "medium" },
  { symbol: "MTL", name: "Millat Tractors Ltd", sector: "Automobile", price: 1245.00, change: 3.5, divYield: 8.5, pe: 9.8, shariah: true, marketCap: "PKR 41B", volume: "0.08M", high52w: 1420, low52w: 980, description: "Leading tractor manufacturer with high dividends.", riskLevel: "low" },
  { symbol: "AGHA", name: "Agha Steel Industries", sector: "Automobile", price: 32.60, change: 2.0, divYield: 4.2, pe: 11.0, shariah: true, marketCap: "PKR 13B", volume: "1.0M", high52w: 42, low52w: 24, description: "Steel and auto components manufacturer.", riskLevel: "high" },

  // ── TECHNOLOGY ───────────────────────────────────────────────────────────
  { symbol: "SYS", name: "Systems Ltd", sector: "Technology", price: 645.80, change: 5.2, divYield: 3.5, pe: 22.5, shariah: true, marketCap: "PKR 78B", volume: "0.4M", high52w: 750, low52w: 520, description: "Leading IT company with global client base.", riskLevel: "medium" },
  { symbol: "TRG", name: "TRG Pakistan Ltd", sector: "Technology", price: 152.40, change: 8.5, divYield: 0.0, pe: 35.0, shariah: true, marketCap: "PKR 92B", volume: "2.5M", high52w: 195, low52w: 90, description: "High-growth BPO and tech conglomerate.", riskLevel: "high" },
  { symbol: "NETSOL", name: "NetSol Technologies", sector: "Technology", price: 185.60, change: 3.2, divYield: 2.8, pe: 18.5, shariah: true, marketCap: "PKR 12B", volume: "0.3M", high52w: 225, low52w: 145, description: "Global software provider for leasing industry.", riskLevel: "high" },
  { symbol: "PICT", name: "Pak Int'l Container", sector: "Technology", price: 285.40, change: 1.5, divYield: 8.5, pe: 8.2, shariah: true, marketCap: "PKR 22B", volume: "0.2M", high52w: 320, low52w: 230, description: "Port container terminal operator.", riskLevel: "medium" },

  // ── POWER / ENERGY ───────────────────────────────────────────────────────
  { symbol: "HUBC", name: "Hub Power Company", sector: "Power", price: 82.40, change: 1.2, divYield: 14.5, pe: 3.8, shariah: false, marketCap: "PKR 119B", volume: "3.5M", high52w: 96, low52w: 68, description: "Largest IPP in Pakistan with high dividend yield.", riskLevel: "low" },
  { symbol: "KAPCO", name: "Kot Addu Power", sector: "Power", price: 58.60, change: 0.8, divYield: 15.2, pe: 3.2, shariah: false, marketCap: "PKR 49B", volume: "1.8M", high52w: 68, low52w: 48, description: "Major power plant with exceptional dividend history.", riskLevel: "low" },
  { symbol: "PKGP", name: "PakGen Power Ltd", sector: "Power", price: 24.80, change: -0.5, divYield: 10.5, pe: 4.5, shariah: false, marketCap: "PKR 21B", volume: "0.5M", high52w: 30, low52w: 20, description: "Thermal power generation company.", riskLevel: "medium" },
  { symbol: "KEL", name: "K-Electric Ltd", sector: "Power", price: 5.80, change: 1.8, divYield: 0.0, pe: 0.0, shariah: false, marketCap: "PKR 66B", volume: "15M", high52w: 8.0, low52w: 4.5, description: "Karachi's electricity utility under privatization.", riskLevel: "high" },
  { symbol: "NCPL", name: "Nishat Chunian Power", sector: "Power", price: 32.60, change: 1.5, divYield: 12.5, pe: 4.0, shariah: false, marketCap: "PKR 14B", volume: "0.8M", high52w: 40, low52w: 25, description: "Textile group's power subsidiary.", riskLevel: "medium" },
  { symbol: "SSGC", name: "Sui Southern Gas", sector: "Power", price: 22.80, change: -1.2, divYield: 3.5, pe: 8.5, shariah: false, marketCap: "PKR 26B", volume: "2.2M", high52w: 30, low52w: 18, description: "Gas utility for Sindh and Balochistan.", riskLevel: "medium" },
  { symbol: "SNGP", name: "Sui Northern Gas", sector: "Power", price: 34.20, change: 0.8, divYield: 4.2, pe: 7.8, shariah: false, marketCap: "PKR 41B", volume: "1.5M", high52w: 42, low52w: 26, description: "Gas utility for Punjab and KPK.", riskLevel: "medium" },

  // ── PHARMA ───────────────────────────────────────────────────────────────
  { symbol: "GSKCH", name: "GSK Consumer Healthcare", sector: "Pharma", price: 156.80, change: 2.5, divYield: 5.5, pe: 14.5, shariah: true, marketCap: "PKR 14B", volume: "0.2M", high52w: 182, low52w: 125, description: "GSK's Pakistan operations in OTC and consumer health.", riskLevel: "medium" },
  { symbol: "SEARLE", name: "The Searle Company", sector: "Pharma", price: 182.40, change: 1.8, divYield: 4.8, pe: 16.5, shariah: true, marketCap: "PKR 26B", volume: "0.3M", high52w: 210, low52w: 152, description: "Growing pharma with branded generics portfolio.", riskLevel: "medium" },
  { symbol: "ABOT", name: "Abbott Laboratories Pak", sector: "Pharma", price: 845.60, change: 3.2, divYield: 3.2, pe: 18.5, shariah: true, marketCap: "PKR 55B", volume: "0.05M", high52w: 980, low52w: 720, description: "Abbott's Pakistan operation with strong brand portfolio.", riskLevel: "low" },
  { symbol: "FEROZ", name: "Ferozsons Laboratories", sector: "Pharma", price: 485.20, change: 1.5, divYield: 4.5, pe: 15.2, shariah: true, marketCap: "PKR 10B", volume: "0.05M", high52w: 545, low52w: 395, description: "Specialized pharma with hepatitis treatment drugs.", riskLevel: "medium" },
  { symbol: "HINOON", name: "Highnoon Laboratories", sector: "Pharma", price: 698.40, change: 2.8, divYield: 3.8, pe: 17.5, shariah: true, marketCap: "PKR 12B", volume: "0.04M", high52w: 795, low52w: 580, description: "Domestic pharma manufacturer.", riskLevel: "medium" },
  { symbol: "MUREB", name: "Murree Brewery", sector: "Food", price: 1285.00, change: -0.5, divYield: 2.5, pe: 12.5, shariah: false, marketCap: "PKR 19B", volume: "0.02M", high52w: 1450, low52w: 1050, description: "Beverages company (non-Halal operations).", riskLevel: "medium" },

  // ── FOOD & CONSUMER ──────────────────────────────────────────────────────
  { symbol: "NESTLE", name: "Nestlé Pakistan Ltd", sector: "Food", price: 7250.00, change: 1.5, divYield: 4.5, pe: 22.5, shariah: true, marketCap: "PKR 340B", volume: "0.008M", high52w: 8200, low52w: 6400, description: "Nestlé's Pakistan operations with dominant FMCG brands.", riskLevel: "low" },
  { symbol: "UNITY", name: "Unity Foods Ltd", sector: "Food", price: 28.60, change: 2.5, divYield: 5.2, pe: 9.5, shariah: true, marketCap: "PKR 28B", volume: "1.2M", high52w: 35, low52w: 22, description: "Major cooking oil and wheat processing company.", riskLevel: "medium" },
  { symbol: "COLG", name: "Colgate-Palmolive Pak", sector: "Food", price: 2845.00, change: 1.2, divYield: 5.5, pe: 18.5, shariah: true, marketCap: "PKR 55B", volume: "0.01M", high52w: 3200, low52w: 2400, description: "Oral and personal care FMCG giant.", riskLevel: "low" },
  { symbol: "DAWH", name: "Dawood Hercules", sector: "Chemicals", price: 198.40, change: 1.8, divYield: 8.5, pe: 5.5, shariah: true, marketCap: "PKR 52B", volume: "0.5M", high52w: 228, low52w: 158, description: "Conglomerate with fertilizer and energy investments.", riskLevel: "medium" },
  { symbol: "FHAM", name: "First Habib Modaraba", sector: "Financial", price: 8.40, change: 0.5, divYield: 9.5, pe: 7.5, shariah: true, marketCap: "PKR 3B", volume: "0.3M", high52w: 10.5, low52w: 6.5, description: "Shariah-compliant modaraba with consistent returns.", riskLevel: "low" },

  // ── TEXTILE ───────────────────────────────────────────────────────────────
  { symbol: "GATM", name: "Gul Ahmed Textile", sector: "Textile", price: 82.60, change: 2.2, divYield: 5.8, pe: 7.5, shariah: true, marketCap: "PKR 23B", volume: "0.6M", high52w: 98, low52w: 65, description: "Leading textile exporter with global brands.", riskLevel: "medium" },
  { symbol: "CLCPS", name: "Crescent Textile", sector: "Textile", price: 35.40, change: 1.5, divYield: 4.5, pe: 9.2, shariah: true, marketCap: "PKR 8B", volume: "0.3M", high52w: 42, low52w: 27, description: "Integrated textile manufacturer.", riskLevel: "medium" },
  { symbol: "INIL", name: "Indus Dyeing", sector: "Textile", price: 145.60, change: 0.8, divYield: 6.2, pe: 8.5, shariah: true, marketCap: "PKR 5B", volume: "0.08M", high52w: 168, low52w: 118, description: "Yarn spinning and fabric manufacturer.", riskLevel: "medium" },
  { symbol: "KNIT", name: "Kohinoor Textile", sector: "Textile", price: 68.40, change: 1.2, divYield: 5.5, pe: 8.8, shariah: true, marketCap: "PKR 14B", volume: "0.4M", high52w: 80, low52w: 54, description: "Textile manufacturer with strong export base.", riskLevel: "medium" },

  // ── STEEL ─────────────────────────────────────────────────────────────────
  { symbol: "ISL", name: "International Steel", sector: "Steel", price: 158.40, change: 3.5, divYield: 7.2, pe: 7.5, shariah: true, marketCap: "PKR 32B", volume: "0.5M", high52w: 185, low52w: 125, description: "CRC steel sheets manufacturer.", riskLevel: "medium" },
  { symbol: "DSFL", name: "Dost Steel Ltd", sector: "Steel", price: 28.60, change: 2.0, divYield: 4.5, pe: 11.5, shariah: true, marketCap: "PKR 7B", volume: "0.4M", high52w: 36, low52w: 20, description: "Steel billet and bar manufacturer.", riskLevel: "high" },

  // ── INSURANCE ─────────────────────────────────────────────────────────────
  { symbol: "JSCL", name: "Jubilee Life Insurance", sector: "Insurance", price: 312.40, change: 1.5, divYield: 4.5, pe: 12.5, shariah: false, marketCap: "PKR 32B", volume: "0.1M", high52w: 365, low52w: 258, description: "Leading life insurance company in Pakistan.", riskLevel: "medium" },
  { symbol: "AVN", name: "Avanceon Ltd", sector: "Technology", price: 68.40, change: 4.2, divYield: 3.5, pe: 18.5, shariah: true, marketCap: "PKR 10B", volume: "0.6M", high52w: 82, low52w: 52, description: "Industrial automation and control systems.", riskLevel: "high" },
  { symbol: "POWER", name: "Power Cement Ltd", sector: "Cement", price: 18.60, change: 1.0, divYield: 2.5, pe: 14.5, shariah: true, marketCap: "PKR 14B", volume: "1.5M", high52w: 24, low52w: 14, description: "Mid-size cement producer in Sindh.", riskLevel: "high" },
  { symbol: "GGL", name: "Ghani Global Holdings", sector: "Chemicals", price: 45.80, change: 2.5, divYield: 5.5, pe: 9.0, shariah: true, marketCap: "PKR 12B", volume: "0.8M", high52w: 55, low52w: 35, description: "Glass and chemical manufacturer.", riskLevel: "medium" },
  { symbol: "MWFS", name: "Millat Tractors (Wheels)", sector: "Automobile", price: 185.60, change: 1.5, divYield: 7.5, pe: 8.5, shariah: true, marketCap: "PKR 8B", volume: "0.2M", high52w: 215, low52w: 148, description: "Tractor components and assembly.", riskLevel: "medium" },
  { symbol: "BATA", name: "Bata Pakistan Ltd", sector: "Consumer", price: 1285.00, change: 2.5, divYield: 3.8, pe: 16.5, shariah: true, marketCap: "PKR 20B", volume: "0.02M", high52w: 1480, low52w: 1050, description: "Leading footwear brand in Pakistan.", riskLevel: "low" },
  { symbol: "SERV", name: "Service Industries", sector: "Consumer", price: 785.40, change: 1.8, divYield: 4.5, pe: 14.5, shariah: true, marketCap: "PKR 18B", volume: "0.05M", high52w: 895, low52w: 645, description: "Footwear and tyre tube manufacturer.", riskLevel: "medium" },
  { symbol: "ILP", name: "International Industries", sector: "Steel", price: 185.60, change: 2.2, divYield: 6.2, pe: 8.5, shariah: true, marketCap: "PKR 24B", volume: "0.3M", high52w: 215, low52w: 150, description: "GI pipes and steel products manufacturer.", riskLevel: "medium" },
  { symbol: "FRAN", name: "Frieslandcampina Engro", sector: "Food", price: 65.80, change: -0.8, divYield: 4.2, pe: 12.5, shariah: true, marketCap: "PKR 16B", volume: "0.5M", high52w: 78, low52w: 52, description: "Dairy products manufacturer (Olpers brand).", riskLevel: "medium" },
  { symbol: "KOSM", name: "Kohinoor One Properties", sector: "Real Estate", price: 12.40, change: 1.5, divYield: 3.5, pe: 15.0, shariah: true, marketCap: "PKR 6B", volume: "0.8M", high52w: 16, low52w: 9, description: "Real estate and property development.", riskLevel: "high" },
];

// NLP Search Engine
export interface NLPQueryResult {
  stocks: PSXStock[];
  aiExplanation: string;
  aiExplanationRomanUrdu: string;
}

const sectorKeywords: Record<string, string[]> = {
  Banking: ["bank", "banking", "financial", "bank sector", "banking sector", "bank stocks"],
  Cement: ["cement", "construction", "concrete", "building materials", "cement sector"],
  "Oil & Gas": ["oil", "gas", "petroleum", "energy", "fuel", "petrol", "oil gas"],
  Fertilizer: ["fertilizer", "fertiliser", "urea", "agriculture", "agri", "khad"],
  Chemicals: ["chemical", "chemicals", "polymer", "engro"],
  Automobile: ["auto", "automobile", "car", "vehicle", "motor", "tractor", "rickshaw", "sazgar"],
  Technology: ["tech", "technology", "software", "it", "digital", "software stocks"],
  Power: ["power", "electricity", "energy", "ipp", "utility", "gas utility", "bijli"],
  Pharma: ["pharma", "pharmaceutical", "medicine", "drug", "health", "healthcare"],
  Food: ["food", "consumer", "fmcg", "dairy", "beverage", "khana"],
  Textile: ["textile", "fabric", "cloth", "yarn", "kapra"],
  Steel: ["steel", "iron", "metal", "lohay"],
};

const romanUrduSectorMap: Record<string, string> = {
  "cement stocks": "Cement",
  "cement sector": "Cement",
  "banking stocks": "Banking",
  "bank stocks": "Banking",
  "oil stocks": "Oil & Gas",
  "gas stocks": "Oil & Gas",
  "fertilizer stocks": "Fertilizer",
  "pharma stocks": "Pharma",
  "tech stocks": "Technology",
  "bijli stocks": "Power",
  "power stocks": "Power",
  "khana stocks": "Food",
  "food stocks": "Food",
  "textile stocks": "Textile",
  "kapra stocks": "Textile",
  "auto stocks": "Automobile",
};

export function nlpSearch(query: string, shariaFilter: boolean = false): NLPQueryResult {
  const q = query.toLowerCase().trim();
  let filtered = [...psxStocks];

  if (shariaFilter) {
    filtered = filtered.filter((s) => s.shariah);
  }

  // Detect sector
  let detectedSector = "";
  for (const [sector, keywords] of Object.entries(sectorKeywords)) {
    if (keywords.some((kw) => q.includes(kw))) {
      detectedSector = sector;
      break;
    }
  }
  for (const [phrase, sector] of Object.entries(romanUrduSectorMap)) {
    if (q.includes(phrase)) {
      detectedSector = sector;
      break;
    }
  }

  if (detectedSector) {
    filtered = filtered.filter(
      (s) =>
        s.sector === detectedSector ||
        (detectedSector === "Oil & Gas" && (s.sector === "Oil & Gas" || s.symbol === "PSO"))
    );
  }

  // Detect specific stock by name or symbol
  const specificStock = psxStocks.find(
    (s) =>
      q.includes(s.symbol.toLowerCase()) ||
      q.includes(s.name.toLowerCase().split(" ")[0])
  );
  if (specificStock && !detectedSector) {
    filtered = [specificStock, ...filtered.filter((s) => s.symbol !== specificStock.symbol)];
  }

  // Risk level filtering
  const isLowRisk = /low risk|kam risk|safe|mehfooz|conservative|stable|security/.test(q);
  const isHighDividend = /high dividend|zyada dividend|dividend wale|income|yield/.test(q);
  const isGrowth = /growth|growing|tezi|barh|appreciation|capital gain/.test(q);
  const isShariah = /shariah|halal|islamic|sharia/.test(q);

  if (isShariah) {
    filtered = filtered.filter((s) => s.shariah);
  }

  // Scoring
  const scored = filtered.map((stock) => {
    let score = 0;
    if (isLowRisk && stock.riskLevel === "low") score += 3;
    if (isLowRisk && stock.riskLevel === "medium") score += 1;
    if (isHighDividend) score += stock.divYield;
    if (isGrowth && stock.change > 2) score += 2;
    if (stock.change > 0) score += 0.5;
    if (stock.shariah) score += 0.5;
    return { stock, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const resultStocks = scored.slice(0, 15).map((s) => s.stock);

  // Generate AI explanation
  let aiExplanation = "";
  let aiExplanationRomanUrdu = "";

  if (detectedSector) {
    aiExplanation = `Found ${resultStocks.length} ${detectedSector} stocks on PSX. ${isLowRisk ? "Results are sorted by lowest risk profile. " : ""}${isHighDividend ? "Results prioritized by highest dividend yield. " : ""}${isShariah ? "Only Shariah-compliant stocks shown. " : ""}These stocks represent the most actively traded and fundamentally strong ${detectedSector} companies.`;
    aiExplanationRomanUrdu = `PSX par ${resultStocks.length} ${detectedSector} stocks mile. ${isLowRisk ? "Nataaij kam risk ke mutabiq tarteeb diye gaye hain. " : ""}${isHighDividend ? "Zyada dividend dene wale stocks pehle dikhaye gaye hain. " : ""}${isShariah ? "Sirf Shariah-compliant stocks dikhaye gaye hain. " : ""}Yeh sabse zyada traded aur mazboot ${detectedSector} companies hain.`;
  } else if (isLowRisk) {
    aiExplanation = `Showing ${resultStocks.length} low-risk PSX stocks. These are stable, blue-chip companies with consistent dividend history and low volatility, suitable for conservative investors.`;
    aiExplanationRomanUrdu = `${resultStocks.length} kam-risk PSX stocks dikhaye ja rahe hain. Yeh stable blue-chip companies hain jinka dividend history achi hai aur volatility kam hai, mehfooz investors ke liye munasib.`;
  } else if (isHighDividend) {
    aiExplanation = `Showing ${resultStocks.length} high dividend PSX stocks, ranked by dividend yield. These companies have strong cash flows and regularly distribute profits to shareholders.`;
    aiExplanationRomanUrdu = `${resultStocks.length} zyada dividend wale PSX stocks dikhaye ja rahe hain, dividend yield ke mutabiq tarteeb diye gaye hain. In companies ki cash flow mazboot hai aur yeh shareholders ko regularly dividend deti hain.`;
  } else {
    aiExplanation = `Showing top ${resultStocks.length} PSX-listed stocks matching your query. Results are ranked by match quality, dividend yield, and market stability.`;
    aiExplanationRomanUrdu = `Aapki talash se milte julte ${resultStocks.length} PSX stocks dikhaye ja rahe hain. Nataaij match quality, dividend yield aur market stability ke mutabiq tarteeb diye gaye hain.`;
  }

  return { stocks: resultStocks, aiExplanation, aiExplanationRomanUrdu };
}

export function getStockBySymbol(symbol: string): PSXStock | undefined {
  return psxStocks.find((s) => s.symbol === symbol.toUpperCase());
}

export function getChartData(symbol: string) {
  const stock = getStockBySymbol(symbol);
  const basePrice = stock?.price || 100;

  // Generate more realistic chart data with trends
  const data = [];
  let currentPrice = basePrice * 0.95; // Start slightly below current price

  for (let i = 0; i < 30; i++) {
    // Add realistic price movement (±3% per day)
    const change = (Math.random() - 0.5) * 0.06 * currentPrice;
    currentPrice += change;

    // Keep price within reasonable range (80-120% of base price)
    currentPrice = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, currentPrice));

    const d = new Date();
    d.setDate(d.getDate() - (30 - i));
    const monthStr = d.toLocaleString('en-US', { month: 'short' });
    const dayStr = d.getDate();

    data.push({
      date: `${monthStr} ${dayStr}`,
      price: +currentPrice.toFixed(2),
    });
  }

  return data;
}
