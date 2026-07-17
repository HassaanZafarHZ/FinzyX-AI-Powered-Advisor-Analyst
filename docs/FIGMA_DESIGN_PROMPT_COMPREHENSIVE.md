# FinzyX AI Advisor — Complete Figma Design Prompt
## Comprehensive UI/UX Requirements for PSX Investment Platform

---

## 🎨 Design System Foundation

**Brand Identity:**
- **Primary Color**: Indigo/Purple gradient (#6366F1 to #8B5CF6)
- **Success**: Green (#639922)
- **Destructive/Error**: Red (#E24B4A)
- **Warning**: Amber/Orange (#F59E0B)
- **Shariah Compliant**: Green with ☪️ icon
- **Currency**: PKR (Pakistani Rupee)
- **Typography**: Modern sans-serif, bilingual support (English + Roman Urdu)

**Platform**: Mobile-first (375px base), responsive web app  
**Dark/Light**: Full theme support  
**Icons**: Lucide React style

---

## 📱 AUTHENTICATION FLOWS

### 1. **Registration Flow (3 Steps)**

#### **Step 1: Sign Up - Basic Details**
- **Title**: "Create your account"
- **Subtitle**: "Start your investment journey today"
- **Fields**:
  - Full Name (text input)
  - Email Address (email validation)
  - Password (password type)
    - **Requirement**: Minimum 8 characters, at least 1 number, 1 special character
    - Placeholder: "Min. 8 chars, 1 number, 1 special char"
    - Show/hide password toggle (eye icon)
  - Confirm Password (password type)
    - Show/hide toggle
- **Password Strength Indicator**:
  - 3-bar visual indicator below password field
  - Colors: Red (Weak), Orange (Medium), Green (Strong)
  - Labels: "Password strength: Weak/Medium/Strong"
  - **Weak**: <8 chars OR missing number/special char → Red
  - **Medium**: ≥8 chars but missing number OR special char → Orange
  - **Strong**: ≥8 chars + number + special char → Green
- **Error States** (red inline text below field):
  - "Password must be at least 8 characters"
  - "Password must contain at least 1 number"
  - "Password must contain at least 1 special character (!@#$%^&*...)"
  - "Passwords do not match"
  - "Email is already in use."
- **Primary CTA**: "Create Account" (full-width button)
- **Footer Links**: 
  - "By signing up, you agree to our Terms of Service and Privacy Policy"
  - "Already have an account? Sign in" (link)

---

#### **Step 2: Success Confirmation**
- **Visual**: Large checkmark icon in circular badge (green/success color)
- **Title**: "Account Created! 🎉"
- **Message**: "Welcome to FinzyX, [First Name]!"
- **Subtext**: "Let's set up your investor profile to get started."
- **CTA**: "Continue to Profile Setup" → redirects to Onboarding

---

### 2. **Login Flow (2 Steps)**

#### **Step 1: Email & Password**
- **Title**: "Welcome back"
- **Subtitle**: "Sign in to your account to continue"
- **Fields**:
  - Email Address
  - Password (with show/hide toggle)
  - "Forgot password?" link (right-aligned, small text)
- **Demo Account Info Box** (light blue/info background):
  - "🔑 Demo Account: demo@finzyx.com / demo123"
- **Error States**:
  - **Unregistered Email** (E1-US2-TC3):
    - Red inline error below email field
    - Message: "No account found with this email address."
    - Email field border turns red
    - Password field remains enabled (not greyed out)
  - **Wrong Password**:
    - Red inline error: "Invalid credentials"
- **Primary CTA**: "Sign In" (full-width)
- **Footer**: "Don't have an account? Sign up"

---

#### **Step 2: Success / Redirect**
- Smooth transition to Dashboard
- Optional: Brief loading state "Signing in..."

---

### 3. **Forgot Password Flow**

#### **Password Reset Request**
- **Title**: "Reset Password"
- **Subtitle**: "We'll send you a reset link"
- **Field**: Email Address (with mail icon prefix)
- **Error State**:
  - "No account found with this email address."
- **CTA**: "Send Reset Link"
- **Back Link**: "← Back to Sign In"

---

#### **Email Sent Confirmation**
- **Visual**: Large checkmark in success-colored circle
- **Title**: "Check your inbox!"
- **Message**: "A password reset link has been sent to [email]. Please check your email and click the link to reset your password."
- **Info Box**: "📧 Didn't receive the email? Check your spam folder or try again."
- **CTA**: "Back to Sign In" (outlined button)

---

## 🚀 ONBOARDING FLOW (3 Steps)

### **Step 1: Personal Information**

- **Title**: "Complete Your Profile"
- **Subtitle**: "Step 1 of 3"
- **Progress Bar**: 3 segments (1st filled with primary color, rest muted)
- **Fields**:
  - **Age (Umar)**: Number input, placeholder "Enter your age", min="18", max="80"
  - **Monthly Income / Maheena Amdani (PKR)**: Number input, placeholder "e.g. 150000"
- **Validation** (E1-US4-TC3):
  - **Invalid Values**: Age -5 or Income 0
  - **Error State**: Both fields highlighted with red border
  - Red inline error below fields: "Please enter a valid age and income."
  - "Generate My Roadmap" button remains disabled/greyed
- **CTA**: "Continue" (disabled until fields valid)

---

### **Step 2: Risk Appetite / Risk Pasandeedgi**

- **Title**: "Risk Profile / Risk Pasandeedgi"
- **Subtitle**: "Select your investment risk tolerance"
- **Progress Bar**: 2 of 3 segments filled
- **Options** (3 cards, single-select):

  **1. Conservative (Mehfooz)** 🛡️
  - "Low risk, stable returns — Suitable for beginners"
  - Border: Green when selected, muted when not

  **2. Moderate (Darmiyani)** ⚖️
  - "Balanced risk and growth — Most popular choice"
  - Border: Primary/blue when selected

  **3. Aggressive (Jadid)** 🚀
  - "High risk, high potential — For experienced investors"
  - Border: Red/orange when selected

- **Selected State**: Thick colored border + checkmark icon in top-right
- **CTAs**: "Back" (secondary), "Continue" (primary, disabled until selection)

---

### **Step 3: Confirmation & Roadmap Generation**

- **Title**: "Profile Summary"
- **Progress Bar**: All 3 segments filled
- **Summary Card** (light background):
  - Age / Umar: [26 years]
  - Monthly Income: PKR 80,000
  - Risk Profile: Moderate
- **AI Roadmap Preview Card** (gradient background):
  - "🤖 AI Roadmap Ready"
  - "Based on your Moderate risk profile, we'll generate a personalized investment roadmap with recommended PSX stocks, allocation strategy, and dividend targets."
- **CTAs**: "Back" (secondary), "Generate My Roadmap 🚀" (primary)

---

### **Welcome Success Popup** (Modal Overlay)

- **Background**: Black overlay with blur
- **Card**: Rounded, gradient header (indigo → purple → pink)
- **Header Section**:
  - Large checkmark icon in white circle
  - "Profile Set! 🎉"
  - "Welcome to FinzyX, [First Name]!"
- **Body Section**:
  - "Your Moderate investor profile and AI roadmap are ready."
  - **Roadmap Preview** (3 columns):
    - Age: 26y
    - Income: PKR 80,000
    - Risk: Moderate
  - **Feature Badges**: "Shariah Filter Ready" (green), "AI Rahbar Active" (blue)
- **CTA**: "Go to Dashboard 🚀"

---

## 📊 DASHBOARD

### **Header Section**

- **Welcome Banner** (gradient background):
  - "Welcome back, [First Name]! 👋"
  - "Here's your investment overview and personalized insights."

---

### **Complete Profile Banner** (if profile incomplete)

- **Background**: Amber/orange gradient with warning icon
- **Layout**: Horizontal flex
- **Icon**: Circular badge with user-check icon (left)
- **Content**:
  - "Complete Your Profile"
  - "Set up your investor profile to get a personalized investment roadmap."
- **CTA**: "Start Setup" button (amber background, right-aligned) with chevron →

---

### **AI Investment Roadmap Card** (if profile complete)

- **Background**: Colored gradient based on risk level:
  - Conservative: Green gradient
  - Moderate: Indigo → Purple gradient
  - Aggressive: Orange → Red gradient
- **Header**:
  - "Your AI Investment Roadmap"
  - "Generated based on your risk profile — Moderate"
  - "Active" badge (white/translucent)
- **3-Column Grid** (white/translucent cards):
  - Equity Allocation: 60%
  - Fixed Income: 40%
  - Expected Dividend: 8.2%
- **Sector Tags**: Banking, Cement, Energy (badge pills)
- **CTA**: "Explore Stocks →" (white/outlined)

---

### **Stats Cards (4-column grid)**

1. **Total Portfolio Value**
   - Icon: Briefcase
   - Value: PKR 485,230
   - Subtext: "+12.5% this month" (green with up arrow)

2. **Today's Change**
   - Icon: Trending Up (green)
   - Value: +PKR 3,250 (green)
   - Subtext: "+0.67% gain"

3. **Total Invested**
   - Icon: Dollar Sign
   - Value: PKR 450,000
   - Subtext: "Across 8 stocks"

4. **Total Gain/Loss**
   - Icon: Trending Up (green)
   - Value: +PKR 35,230 (green)
   - Subtext: "+7.83% return"

---

### **Watchlist Table**

- **Header**: "Watchlist" with "View All Stocks →" link
- **Columns**: Stock | Sector | Price | Change | Div Yield
- **Rows**: Clickable, hover effect
- **Example Row**:
  - MCB Bank Limited (MCB)
  - Banking sector badge
  - PKR 245.50
  - +2.5% (green with up arrow)
  - 8.5%

---

## 🤖 AI RAHBAR (CHAT INTERFACE)

### **AI Rahbar Locked State** (Incomplete Profile)

- **Card**: Amber/orange border and background tint
- **Icon**: Bot icon in amber circle
- **Title**: "Complete Your Profile First"
- **Message**:
  - English: "Before the AI Rahbar can generate your investment roadmap, please complete your investor profile. We need your age, monthly income, and risk appetite to provide personalized recommendations."
  - Roman Urdu: "AI Rahbar roadmap generate karne se pehle apna investor profile complete karein. Humein aapki umar, monthly income, aur risk appetite ki zaroorat hai."
- **CTA**: "Complete Profile" (amber button)

---

### **AI Rahbar Active State**

#### **Header**
- **Title**: "AI Rahbar" with bot icon
- **Subtitle**: 
  - English: "Your intelligent PSX financial advisor — chat in English or Roman Urdu"
  - Roman Urdu: "Aapka zeheen PSX investment advisor — Roman Urdu ya English mein baat karein"

---

#### **Chat Messages**

**Assistant Message (Left-aligned):**
- Bot avatar (circular, primary color background)
- Message bubble (light grey/muted background)
- **Example**: "Assalam-o-Alaikum! Main aapka AI financial advisor hoon. PSX stocks, Shariah compliance, ya apne investment roadmap ke baray mein kuch bhi puchein."
- **Stock Links** (if stocks mentioned):
  - "View Details:" label
  - Stock badges: "📊 MCB →" (clickable, primary color)

**User Message (Right-aligned):**
- User avatar (circular, primary background with user icon)
- Message bubble (primary color background, white text)

**Typing Indicator:**
- Bot avatar + animated 3-dot pulse in message bubble

---

#### **Input Area**

**Quick Suggestions** (pill buttons above input):
- English: "Show me cement sector stocks", "High dividend PSX stocks", "Analyze MCB Bank"
- Roman Urdu: "mujhe cement stocks dekhao", "zyada dividend wale stocks", "halal stocks batao"

**Language Detection Badge** (E6-US1-TC2):
- Appears when user types mixed language
- **Mixed Language**: "🌐 Detected: English + Roman Urdu"
- **Roman Urdu**: "🇵🇰 Detected: Roman Urdu"
- **English**: "🇬🇧 Detected: English"
- Example query: "show me halal banking stocks jo zyada dividend dein"

**Input Field:**
- Placeholder: "Ask anything... (e.g., 'show me cement stocks')" or Roman Urdu variant
- Send button (paper plane icon, primary color)

---

#### **Out-of-Scope Query Response**

**Example User Query:** "What is the share price of Apple on the New York Stock Exchange?"

**AI Response:**
- "🤖 AI Rahbar — PSX Stocks Only"
- "I apologize, but I only cover stocks listed on the Pakistan Stock Exchange (PSX). Please rephrase your query to focus on a Pakistani market company (for example, 'ENGRO', 'MCB', or 'LUCK')."
- Roman Urdu variant also supported

---

## 🔍 STOCK SCREENER

### **Search Bar**

- **Header**: "Smart Stock Screener" with sparkle icon
- **Subtitle**: "Search stocks using natural language"
- **Input**: Large search field with magnifying glass icon
  - Placeholder: "Try: low risk cement stocks, high dividend banking sector"
- **Search Button**: "Search" (primary color)

**Quick Searches** (pill buttons):
- "low risk cement stocks"
- "high dividend banking sector"
- "Shariah compliant energy"
- "fertilizer stocks"
- "technology growth"

---

### **Shariah Compliance Toggle**

- **Component**: Toggle switch with label
- **Active State**: Green background
  - ☪️ "Shariah Filter Active"
  - Banner below: "Showing only Shariah-compliant stocks verified by Islamic finance criteria"
  - Badge: "Active" (green)

---

### **AI Insight Card** (after search)

- **Background**: Light primary color tint
- **Icon**: Sparkle icon (primary color)
- **Label**: "AI Insight"
- **Content**: "Based on your search 'high dividend banking sector', these PSX banking stocks offer yields above 8%. MCB and HBL lead with government backing and strong fundamentals."

---

### **Results Table**

- **Header**: "Search Results" | "42 stocks found"
- **Columns**: Stock | Sector | Price | Change | Div Yield | P/E | Shariah | Watch
- **Example Row**:
  - **MCB Bank Limited** (MCB)
  - Banking badge
  - PKR 245.50
  - +2.5% (green, up arrow)
  - 8.5%
  - 7.2
  - ✓ Halal (green badge)
  - Star icon (watchlist toggle)
- **Hover State**: Light background, cursor pointer
- **Click**: Navigate to stock detail page

---

### **Empty State — Unrecognized Query**

**Condition**: Search returns 0 results

**Design**:
- **Icon**: Search icon with "X" overlay (muted)
- **Title**: "No results found"
- **Message**: "We couldn't find any stocks matching your query."
- **Subheading**: "Try these alternative searches:"
- **2 Suggestion Buttons** (muted background, clickable):
  1. "high dividend paying stocks"
  2. "low risk cement sector"

---

## 📈 STOCK DETAIL PAGE

### **Header Section**

- **Back Button**: "← Back" (top-left)
- **Stock Symbol**: Large bold text (e.g., "MCB")
- **Badges** (inline):
  - Sector: "Banking"
  - **Shariah Compliance** (E5-US2-TC1 & TC2):
    - **Compliant**: Green pill "✓ Shariah Compliant"
    - **Non-Compliant**: Red pill "✕ Not Shariah Compliant"
  - Risk Level:
    - Low: Green "Low Risk"
    - Medium: Orange "Medium Risk"
    - High: Red "High Risk"
- **Company Name**: MCB Bank Limited

---

### **Action Buttons**

- "Add to Watchlist" (outlined, star icon)
- "Add to Portfolio" (primary, plus icon)

---

### **Price Card** (Gradient Background)

- **Label**: "Live PSX Price"
- **Price**: PKR 245.50 (large, bold)
- **Change**: +2.5% (green with up arrow)
- **Subtext**: "Today's change"
- **Additional Metrics**:
  - Volume: 2.5M
  - Market Cap: PKR 98.5B

---

### **Key Metrics Grid** (4 columns)

1. **Dividend Yield**: 8.5% (green)
2. **P/E Ratio**: 7.2
3. **52W High**: PKR 285
4. **52W Low**: PKR 190

---

### **Shariah Compliance Card**

- **Compliant Stock**:
  - Green border, light green background
  - ☪️ icon
  - "Shariah Compliant"
  - "This stock meets all Islamic finance criteria and is approved by Shariah Supervisory Boards."

- **Non-Compliant Stock**:
  - Red border, light red background
  - ✕ icon
  - "Not Shariah Compliant"
  - "This stock has non-compliant revenue streams and does not meet Islamic finance criteria."

---

### **30-Day Price Chart** (E4-US2-TC1)

- **Title**: "30-Day Price Chart"
- **Chart Type**: Line chart (Recharts library)
- **X-Axis**: Dates (May 1 - May 30)
- **Y-Axis**: Price (PKR)
- **Line Color**: Primary gradient
- **Tooltip**: Shows date and price on hover
- **Data**: Random/realistic price fluctuations (±3% daily movement, 80-120% of base price range)
- **Example Data Points**:
  - May 1: PKR 238.50
  - May 15: PKR 245.20
  - May 30: PKR 248.75

---

### **AI Summary Card**

- **Icon**: 🤖 Robot emoji
- **Title**: "AI Summary" (English) / "AI Ka Mashwara" (Roman Urdu)
- **Content** (1 paragraph, ~4-5 sentences):
  - Example: "MCB Bank Limited is a PSX-listed Banking company. The stock is fully Shariah-compliant and meets all Islamic finance criteria. With a dividend yield of 8.5%, it offers attractive income for dividend investors. The P/E ratio of 7.2 suggests the stock is attractively valued relative to peers. Analysts maintain a positive outlook on MCB given Pakistan's economic growth trajectory and sector fundamentals."

---

## 💼 PORTFOLIO MANAGEMENT

### **Portfolio Dashboard Header**

- **Title**: "Portfolio"
- **Market Status Badge** (E4-US2-TC2):
  - **Market Open** (9:30 AM - 3:30 PM PKT): No badge
  - **Market Closed**: Amber/orange badge with alert icon
    - "🔴 Market Closed"
    - Subtitle: "PSX Market Hours: 9:30 AM - 3:30 PM PKT"
- **Action Button**: "Add Trade" (plus icon)

---

### **Stats Cards (4-column grid)**

1. **Total Value**: PKR 485,230
2. **Total Invested**: PKR 450,000
3. **Total Gain/Loss**: +PKR 35,230 (green)
4. **Holdings**: 4 stocks

---

### **Holdings Table**

- **Columns**: Stock | Sector | Quantity | Buy Price | Current Price | P/L Amount | P/L % | Actions
- **Current Price Column**:
  - **Market Open**: PKR 245.50 (bold)
  - **Market Closed** (E4-US2-TC2):
    - PKR 245.50 (bold)
    - "Last close price" (muted, smaller text below)
- **P/L Coloring**: Green for profit, red for loss
- **Actions Column**: 
  - Edit icon (✏️ pencil, blue/primary) 
  - Delete icon (🗑️ trash, red)

---

### **Add Trade Modal**

- **Title**: "Add New Trade"
- **Fields**:
  - Ticker Symbol (e.g., MCB, OGDC)
  - Buy Price (PKR) — number input
  - Quantity — number input
  - Buy Date — date picker
- **Validation**:
  - All fields required
  - "Ticker not found on PSX. Please check the symbol and try again."
  - **Negative Price** (E4-US1-TC2 extended):
    - User enters -100 in Buy Price field
    - Field border turns red
    - Inline error: "⚠ Please enter a valid buy price greater than zero."
    - Save button disabled
  - Quantity must be > 0
- **Buttons**: "Cancel" (outlined), "Add Trade" (primary)

---

### **Edit Trade Modal** (E4-US4-TC1 & TC2)

- **Title**: "Edit Trade - [SYMBOL]"
- **Info Card** (muted background):
  - Stock name and sector
  - "Current Price: PKR 245.50"
- **Fields**:
  - Buy Price (PKR) — pre-filled with current value (e.g., 500)
  - Quantity — pre-filled (e.g., 100)
- **Valid Edit** (TC1):
  - User changes: Buy Price → 480, Quantity → 120
  - After save: P/L recalculated instantly on portfolio card
  - Success toast: "✓ Trade updated successfully"
- **Invalid Edit** (TC2):
  - User enters -100 in Buy Price
  - Field border turns red
  - Red inline error: "⚠ Please enter a valid buy price greater than zero."
  - Save button disabled
- **Buttons**: "Cancel" (outlined), "Save Changes" (primary)

---

### **Delete Trade Confirmation Modal** (E4-US5-TC1 & TC2)

- **Title**: "Delete Trade?" (red/destructive color)
- **Message**: "This will permanently remove [SYMBOL] from your portfolio and update your total P&L."
- **Stock Info Card** (muted background):
  - MCB Bank Limited (MCB)
  - 50 shares @ PKR 230
- **Buttons**:
  - "Cancel" (secondary, outlined) — TC2: dismisses modal, trade unchanged
  - "Delete" (red/destructive, filled) — TC1: removes trade, updates P/L
- **Animation**: Fade-out on successful deletion

---

## 📅 DIVIDEND CALENDAR

### **Stats Cards (3-column grid)**

1. **Monthly Dividend Income**: PKR 1,245 (green)
2. **Upcoming Payments**: 4 events
3. **Avg Dividend Yield**: 8.5%

---

### **Upcoming Dividend Payments Card**

- **Title**: "Upcoming Dividend Payments" with calendar icon
- **Empty State** (E4-US3-TC2):
  - Calendar icon (muted, centered)
  - "No upcoming dividends in the next 90 days"
  - No blank screen
- **List Items** (if data exists):
  - **Stock**: MCB (bold)
  - **Status Badge**: "Confirmed" (green) or "Estimated" (yellow)
  - **Company Name**: MCB Bank Limited
  - **Amount**: PKR 12.5
  - **Ex-date**: 2026-06-15

---

### **Calendar Grid** (Monthly View)

- 7-column grid (days of week)
- Days with dividend events: Green dot indicator at bottom of cell
- Hover: Tooltip showing stock symbol and amount

---

## 👤 MY PROFILE

### **Personal Details Card**

- **Profile Picture**: Circular avatar with user icon
- **Name**: [Full Name]
- **Email**: [Email] (non-editable)
- **Fields**:
  - Full Name (editable)
  - Email Address (disabled/greyed, with note "Email cannot be changed")
  - Phone Number (editable, optional)
- **CTA**: "Save Changes"
- **Success Toast**: "✓ Profile updated successfully!"

---

### **Investor Profile Card**

- **Fields**:
  - Age (number, 18-80)
  - Monthly Income (PKR) (number)
  - Risk Appetite (3 card options: Conservative/Moderate/Aggressive)
- **Validation**:
  - **Empty/Zero Values**: Profile NOT saved
  - Age ≤ 0 or > 150: Not saved
  - Income ≤ 0: Not saved
  - No error message shown (silent validation)
- **CTA**: "Update Profile"
- **Success Toast**: "✓ Profile updated successfully!"

---

### **Language Preference Card**

- **Title**: "Language" with globe icon
- **Description**: "All screens and AI Rahbar will respond in the selected language."
- **Options** (2 buttons):
  - **English** (selected: primary background + ✓)
  - **Roman Urdu** (selected: primary background + ✓)
- **Persistence**: Saved across sessions

---

### **Profile Completion Card**

- **Title**: "Profile Completion"
- **Progress Bar**: Percentage filled (e.g., 100%)
- **Checklist**:
  - ✓ Personal Details (green check)
  - ✓ Investor Profile (green check)
  - ✓ Language (green check)
- **Incomplete Items**: ○ (hollow circle, muted text)

---

## 🎨 COMPONENT DESIGN SPECIFICATIONS

### **Error States**
- **Color**: #E24B4A (red)
- **Icon**: ⚠ or ✕ prefix
- **Field Border**: 2px red border
- **Inline Text**: Red text below field, 12px font size

### **Success States**
- **Color**: #639922 (green)
- **Icon**: ✓ prefix
- **Toast**: Green background, white text, top-right position, 3s auto-dismiss

### **Loading States**
- **Button**: "Loading..." text with spinner icon
- **Skeleton**: Animated pulse for data loading

### **Badges**
- **Shariah Compliant**: Green pill with ☪️ icon, white text
- **Not Shariah Compliant**: Red pill with ✕ icon, white text
- **Market Closed**: Amber pill with 🔴 or alert icon
- **Risk Levels**: Green (low), Orange (medium), Red (high)

### **Modals/Dialogs**
- **Overlay**: Black with 60% opacity, blur effect
- **Card**: Rounded corners (12px), shadow, white/dark background
- **Max Width**: 500px (mobile), centered
- **Padding**: 24px
- **Button Layout**: Horizontal flex, gap 12px

### **Tables**
- **Header**: Muted text, 12px uppercase
- **Rows**: Hover effect (light background), 16px padding
- **Borders**: Subtle dividers between rows
- **Clickable Rows**: Cursor pointer, transition effect

---

## 📐 LAYOUT & SPACING

- **Mobile Base**: 375px width
- **Desktop Max**: 1440px (centered container)
- **Padding**: 16px (mobile), 24px (tablet), 32px (desktop)
- **Card Spacing**: 16px gap between cards
- **Section Spacing**: 32px vertical gap
- **Typography Scale**:
  - H1: 24px (mobile), 32px (desktop)
  - H2: 20px (mobile), 24px (desktop)
  - Body: 14px (mobile), 16px (desktop)
  - Small: 12px
  - Tiny: 10px

---

## 🌐 BILINGUAL SUPPORT

**All screens must support:**
- **English**: Left-aligned text, Western numerals
- **Roman Urdu**: Right-aligned text where appropriate, Roman script
- **Language Toggle**: Accessible from Profile → Language Preference
- **Persistence**: Language choice saved in localStorage
- **Dynamic Content**: AI Rahbar responses, error messages, labels all translate

---

## ✅ FINAL CHECKLIST

**Before submission, ensure all screens include:**
- [ ] Dark mode + Light mode variants
- [ ] Mobile (375px) + Desktop (1440px) breakpoints
- [ ] Error states for all forms
- [ ] Empty states for all lists/tables
- [ ] Loading states for async actions
- [ ] Success confirmation for all mutations
- [ ] Bilingual labels (English + Roman Urdu)
- [ ] Accessibility: ARIA labels, keyboard navigation, color contrast
- [ ] Consistent icon library (Lucide React)
- [ ] PKR currency formatting throughout
- [ ] PSX stock ticker symbols (3-4 letter codes)
- [ ] Shariah compliance indicators on all stock displays

---

## 🎯 PRIORITY SCREENS FOR FIRST REVIEW

1. **Registration + Password Validation** (8 chars, number, special char)
2. **Login + Unregistered Email Error**
3. **Onboarding + Invalid Age/Income Error**
4. **Portfolio + Market Closed State + Edit/Delete Modals**
5. **Stock Detail + Shariah Labels + Dynamic Chart**
6. **AI Rahbar + Language Detection + Out-of-Scope Response**
7. **Screener + Empty State**
8. **My Profile + Validation**

---

**Design Platform**: Figma  
**Handoff Format**: Design tokens + component library + prototype links  
**Developer Handoff Tools**: Figma Inspect, Auto Layout specs, color/typography tokens  

**🚀 This prompt is production-ready. All test cases, edge cases, and user flows are covered.**
