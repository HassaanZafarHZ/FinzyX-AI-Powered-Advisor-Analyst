import { useState, useEffect } from "react";
import { AppLayout } from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { User, Mail, Phone, CheckCircle, Globe } from "lucide-react";
import { cn } from "../../lib/utils";
import { useApp, Language } from "../../contexts/AppContext";

export const Profile = () => {
  const { currentUser, investorProfile, updateUser, saveInvestorProfile, language, setLanguage, t } = useApp();

  const [personalForm, setPersonalForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
  });

  const [investorForm, setInvestorForm] = useState({
    age: investorProfile?.age || "",
    income: investorProfile?.income || "",
    riskAppetite: investorProfile?.riskAppetite || "moderate" as "conservative" | "moderate" | "aggressive",
  });

  const [personalSaved, setPersonalSaved] = useState(false);
  const [investorSaved, setInvestorSaved] = useState(false);
  const [investorErrorMsg, setInvestorErrorMsg] = useState("");
  const [ageError, setAgeError] = useState(false);
  const [incomeError, setIncomeError] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setPersonalForm({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (investorProfile) {
      setInvestorForm({
        age: investorProfile.age || "",
        income: investorProfile.income || "",
        riskAppetite: investorProfile.riskAppetite || "moderate",
      });
    }
  }, [investorProfile]);

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: personalForm.name, phone: personalForm.phone });
    setPersonalSaved(true);
    setTimeout(() => setPersonalSaved(false), 3000);
  };

  const handleSaveInvestor = (e: React.FormEvent) => {
    e.preventDefault();
    setInvestorErrorMsg("");
    setAgeError(false);
    setIncomeError(false);

    if (!investorForm.age || !investorForm.income || !investorForm.riskAppetite) {
      setInvestorErrorMsg("Please complete all required fields.");
      setAgeError(!investorForm.age);
      setIncomeError(!investorForm.income);
      return;
    }

    const age = Number(investorForm.age);
    const income = Number(investorForm.income);
    let ageErr = false;
    let incomeErr = false;
    let hasErr = false;

    if (age <= 0 || age > 150) {
      ageErr = true;
      hasErr = true;
    }
    if (income <= 0) {
      incomeErr = true;
      hasErr = true;
    }

    if (hasErr) {
      setInvestorErrorMsg("Please enter a valid age and income.");
      setAgeError(ageErr);
      setIncomeError(incomeErr);
      return;
    }

    saveInvestorProfile({
      age: investorForm.age,
      income: investorForm.income,
      riskAppetite: investorForm.riskAppetite,
      completed: true,
    });
    setInvestorSaved(true);
    setTimeout(() => setInvestorSaved(false), 3000);
  };

  const profileItems = [
    { label: t("personalDetails"), done: !!(currentUser?.name && currentUser?.email) },
    { label: t("investorProfile"), done: !!(investorProfile?.completed) },
    { label: t("language"), done: true },
  ];
  const completionPct = Math.round((profileItems.filter((i) => i.done).length / profileItems.length) * 100);

  const riskOptions = [
    { value: "conservative" as const, label: language === "roman-urdu" ? "🛡️ Mehfooz (Conservative)" : "🛡️ Conservative", desc: language === "roman-urdu" ? "Kam risk, stable returns" : "Low risk, stable returns" },
    { value: "moderate" as const, label: language === "roman-urdu" ? "⚖️ Darmiyani (Moderate)" : "⚖️ Moderate", desc: language === "roman-urdu" ? "Balanced risk aur growth" : "Balanced risk and growth" },
    { value: "aggressive" as const, label: language === "roman-urdu" ? "🚀 Jadid (Aggressive)" : "🚀 Aggressive", desc: language === "roman-urdu" ? "Zyada risk, zyada faida" : "High risk, high potential" },
  ];

  const langs: { value: Language; label: string; native: string }[] = [
    { value: "english", label: "English", native: "English" },
    { value: "roman-urdu", label: "Roman Urdu", native: "Roman Urdu" },
  ];

  return (
    <AppLayout>
      {/* Save Toast */}
      {(personalSaved || investorSaved) && (
        <div className="fixed top-4 right-4 z-50 bg-success text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {language === "roman-urdu" ? "Profile update ho gayi! ✓" : "Profile updated successfully! ✓"}
        </div>
      )}

      <div className="w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{t("myProfile")}</h1>
          <p className="text-muted-foreground">
            {language === "roman-urdu"
              ? "Apni account settings aur preferences manage karein"
              : "Manage your account settings and preferences"}
          </p>
        </div>

        {/* Bottom Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
          {/* Left Column (2/3 width) - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <Card className="shadow-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-base font-bold">{t("personalDetails")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSavePersonal} className="space-y-6">
                  <div className="flex items-center gap-4 pb-4 border-b border-border/40">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{currentUser?.name || "User"}</h3>
                      <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                      <Button variant="outline" size="sm" className="mt-2 text-xs h-8" type="button">
                        {language === "roman-urdu" ? "Photo Badlein" : "Change Photo"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                        <User className="h-3.5 w-3.5" />
                        {language === "roman-urdu" ? "Poora Naam" : "Full Name"}
                      </label>
                      <Input
                        value={personalForm.name}
                        onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                        placeholder={language === "roman-urdu" ? "Apna naam likhein" : "Enter your full name"}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                        <Mail className="h-3.5 w-3.5" />
                        {language === "roman-urdu" ? "Email Address" : "Email Address"}
                      </label>
                      <Input
                        type="email"
                        value={personalForm.email}
                        disabled
                        className="opacity-60 cursor-not-allowed text-sm"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        {language === "roman-urdu" ? "Email change nahi ho sakta" : "Email cannot be changed"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                        <Phone className="h-3.5 w-3.5" />
                        {language === "roman-urdu" ? "Phone Number" : "Phone Number"}
                      </label>
                      <Input
                        type="tel"
                        value={personalForm.phone}
                        onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                        placeholder="+92 300 1234567"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="font-semibold shadow-sm text-xs h-9">
                    {t("saveChanges")}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Investor Profile */}
            <Card className="shadow-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-base font-bold">{t("investorProfile")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSaveInvestor} className="space-y-6">
                  {investorErrorMsg && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-md">
                      {investorErrorMsg}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("age")}</label>
                      <Input
                        type="number"
                        value={investorForm.age}
                        onChange={(e) => setInvestorForm({ ...investorForm, age: e.target.value })}
                        placeholder={language === "roman-urdu" ? "Apni umar likhein" : "Enter your age"}
                        error={ageError}
                        required
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("monthlyIncome")}</label>
                      <Input
                        type="number"
                        value={investorForm.income}
                        onChange={(e) => setInvestorForm({ ...investorForm, income: e.target.value })}
                        placeholder="e.g. 150000"
                        error={incomeError}
                        required
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("riskAppetite")}</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {riskOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setInvestorForm({ ...investorForm, riskAppetite: opt.value })}
                          className={cn(
                            "p-4 rounded-xl border text-left transition-all",
                            investorForm.riskAppetite === opt.value
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <p className="font-bold text-xs text-foreground">{opt.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="font-semibold shadow-sm text-xs h-9">{t("updateProfile")}</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (1/3 width) - Status & Settings */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card className="shadow-sm">
              <CardHeader className="border-b border-border/40 pb-3">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>{t("profileCompletion")}</span>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Setup Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {language === "roman-urdu" ? "Profile Progress" : "Profile Progress"}
                    </span>
                    <span className="text-xs font-extrabold text-primary">{completionPct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {profileItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all",
                          item.done 
                            ? "bg-success/15 border-success text-success" 
                            : "bg-muted/50 border-border text-muted-foreground"
                        )}
                      >
                        {item.done
                          ? <span className="text-[10px] font-bold">✓</span>
                          : <span className="text-[10px] font-bold">○</span>
                        }
                      </div>
                      <span className={cn("text-xs font-medium", item.done ? "text-foreground" : "text-muted-foreground")}>
                        {item.label} {!item.done && (language === "roman-urdu" ? "(Baki hai)" : "(Pending)")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Language Preference */}
            <Card className="shadow-sm">
              <CardHeader className="border-b border-border/40 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  {t("language")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed font-medium">
                  {language === "roman-urdu"
                    ? "Tamam screens aur AI Rahbar chunni gayi zaban mein jawab dengay."
                    : "All screens and AI Rahbar will respond in the selected language."}
                </p>
                <div className="flex gap-2.5 flex-wrap">
                  {langs.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => setLanguage(l.value)}
                      className={cn(
                        "px-4 py-2.5 rounded-lg border text-xs transition-all font-semibold flex items-center gap-1.5",
                        language === l.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {l.native}
                      {language === l.value && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
