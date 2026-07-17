import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "./AuthLayout";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { cn } from "../../../lib/utils";
import { CheckCircle, TrendingUp, Shield, Zap } from "lucide-react";
import { useApp } from "../../../contexts/AppContext";

interface WelcomePopupProps {
  name: string;
  risk: string;
  onClose: () => void;
}

const WelcomePopup = ({ name, risk, onClose }: WelcomePopupProps) => {
  const roadmapData = {
    conservative: { equity: "30%", fixed: "70%", dividend: "10.5%", sectors: ["Banking", "Fertilizer", "Power"] },
    moderate: { equity: "60%", fixed: "40%", dividend: "8.2%", sectors: ["Banking", "Cement", "Energy"] },
    aggressive: { equity: "85%", fixed: "15%", dividend: "5.5%", sectors: ["Technology", "Automobile", "Chemicals"] },
  };
  const profile = roadmapData[risk as keyof typeof roadmapData] || roadmapData.moderate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden">
        {/* Gradient Header */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Profile Set! 🎉</h2>
          <p className="text-white/85">Welcome to FinzyX, {name}!</p>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Your personalized investment roadmap has been created based on your{" "}
              <span className="font-semibold text-foreground capitalize">{risk}</span> risk profile.
            </p>
          </div>

          {/* Roadmap Preview */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-primary/20 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Your AI Roadmap
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-background rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Equity</p>
                <p className="font-bold text-primary">{profile.equity}</p>
              </div>
              <div className="bg-background rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Fixed Income</p>
                <p className="font-bold">{profile.fixed}</p>
              </div>
              <div className="bg-background rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Expected Div</p>
                <p className="font-bold text-success">{profile.dividend}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.sectors.map((s) => (
                <span key={s} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-success/5 border border-success/20 rounded-lg p-3">
              <Shield className="h-4 w-4 text-success shrink-0" />
              <span className="text-xs text-success font-medium">Shariah Filter Ready</span>
            </div>
            <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg p-3">
              <Zap className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs text-primary font-medium">AI Rahbar Active</span>
            </div>
          </div>

          <Button onClick={onClose} className="w-full" size="lg">
            Go to Dashboard 🚀
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Onboarding = () => {
  const navigate = useNavigate();
  const { saveInvestorProfile, currentUser } = useApp();
  const [step, setStep] = useState(1);
  const [showWelcome, setShowWelcome] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    monthlyIncome: "",
    riskAppetite: "" as "conservative" | "moderate" | "aggressive" | "",
  });

  const riskProfiles = [
    {
      value: "conservative" as const,
      title: "Conservative (Mehfooz)",
      description: "Low risk, stable returns — Suitable for beginners",
      icon: "🛡️",
      color: "border-success/50 bg-success/5",
    },
    {
      value: "moderate" as const,
      title: "Moderate (Darmiyani)",
      description: "Balanced risk and growth — Most popular choice",
      icon: "⚖️",
      color: "border-primary/50 bg-primary/5",
    },
    {
      value: "aggressive" as const,
      title: "Aggressive (Zyada Risk)",
      description: "High risk, high potential — For experienced investors",
      icon: "🚀",
      color: "border-destructive/50 bg-destructive/5",
    },
  ];

  const [errorMsg, setErrorMsg] = useState("");
  const [ageError, setAgeError] = useState(false);
  const [incomeError, setIncomeError] = useState(false);

  const handleNext = () => {
    setErrorMsg("");
    setAgeError(false);
    setIncomeError(false);

    if (step === 1) {
      let hasError = false;
      let ageErr = false;
      let incomeErr = false;

      if (!formData.age || !formData.monthlyIncome) {
        setErrorMsg("Please complete all required fields.");
        if (!formData.age) ageErr = true;
        if (!formData.monthlyIncome) incomeErr = true;
        setAgeError(ageErr);
        setIncomeError(incomeErr);
        return;
      }

      // E1-US4-TC3: Validate age and income values
      const age = Number(formData.age);
      const income = Number(formData.monthlyIncome);

      if (age <= 0 || age > 150) {
        ageErr = true;
        hasError = true;
      }
      if (income <= 0) {
        incomeErr = true;
        hasError = true;
      }

      if (hasError) {
        setErrorMsg("Please enter a valid age and income.");
        setAgeError(ageErr);
        setIncomeError(incomeErr);
        return;
      }
    }
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = () => {
    const profile = {
      age: formData.age,
      income: formData.monthlyIncome,
      riskAppetite: formData.riskAppetite,
      completed: true,
    };
    saveInvestorProfile(profile);
    setShowWelcome(true);
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    navigate("/dashboard");
  };

  return (
    <>
      {showWelcome && (
        <WelcomePopup
          name={currentUser?.name?.split(" ")[0] || "Investor"}
          risk={formData.riskAppetite || "moderate"}
          onClose={handleWelcomeClose}
        />
      )}

      <AuthLayout title="Complete Your Profile" subtitle={`Step ${step} of 3`}>
        <div className="space-y-6">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-lg">Personal Information</h3>

              {errorMsg && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium text-foreground">
                  Age (Umar)
                </label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  error={ageError}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="income" className="text-sm font-medium text-foreground">
                  Monthly Income / Maheena Amdani (PKR)
                </label>
                <Input
                  id="income"
                  type="number"
                  placeholder="e.g. 150000"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  error={incomeError}
                  required
                />
              </div>

              <Button
                onClick={handleNext}
                className="w-full"
                size="lg"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-lg">Risk Profile / Risk Pasandeedgi</h3>
              <p className="text-sm text-muted-foreground">
                Select your investment risk tolerance
              </p>

              <div className="space-y-3">
                {riskProfiles.map((profile) => (
                  <button
                    key={profile.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, riskAppetite: profile.value })}
                    className={cn(
                      "w-full p-4 rounded-lg border-2 text-left transition-all",
                      formData.riskAppetite === profile.value
                        ? profile.color + " border-2"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{profile.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold">{profile.title}</h4>
                        <p className="text-sm text-muted-foreground">{profile.description}</p>
                      </div>
                      {formData.riskAppetite === profile.value && (
                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1"
                  size="lg"
                  disabled={!formData.riskAppetite}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-lg">Profile Summary</h3>

              <div className="space-y-3 bg-secondary/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Age / Umar</span>
                  <span className="font-medium">{formData.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Income</span>
                  <span className="font-medium">PKR {Number(formData.monthlyIncome).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Risk Profile</span>
                  <span className="font-medium capitalize">{formData.riskAppetite}</span>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span>🤖</span>
                  AI Roadmap Ready
                </h4>
                <p className="text-sm text-muted-foreground">
                  Based on your{" "}
                  <strong className="text-foreground capitalize">{formData.riskAppetite}</strong>{" "}
                  risk profile, we'll generate a personalized investment roadmap with recommended
                  PSX stocks, allocation strategy, and dividend targets.
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1" size="lg">
                  Generate My Roadmap 🚀
                </Button>
              </div>
            </div>
          )}
        </div>
      </AuthLayout>
    </>
  );
};
