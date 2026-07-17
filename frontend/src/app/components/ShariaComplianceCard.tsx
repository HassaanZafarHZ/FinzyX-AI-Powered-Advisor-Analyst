import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Badge } from "./Badge";
import { useApp } from "../../contexts/AppContext";

interface ShariaComplianceCardProps {
  isCompliant: boolean;
  className?: string;
}

export const ShariaComplianceCard = ({ isCompliant, className }: ShariaComplianceCardProps) => {
  const { language } = useApp();

  if (isCompliant) {
    return (
      <Card className={cn("border-shariah-border bg-shariah-background", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">☪️</span>
              {language === "roman-urdu" ? "Shariah Compliant (Halal)" : "Shariah Compliant"}
            </CardTitle>
            <Badge variant="shariah">{language === "roman-urdu" ? "Halal" : "Halal"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {language === "roman-urdu"
              ? "Yeh stock Islamic finance ke tamam asoolon ke mutabiq hai aur Shariah-compliant hai."
              : "This stock meets Islamic finance criteria and is certified Shariah-compliant."}
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>
                {language === "roman-urdu" ? "Qarz ki had limit ke andar hai" : "Debt ratio within limits"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>
                {language === "roman-urdu" ? "Karobar Shariah ke mutabiq hai" : "Halal business activities"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>
                {language === "roman-urdu" ? "Sood ki aamdani limit se kam hai" : "Interest income below threshold"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-error-border bg-error-background", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-error-text">
            <XCircle className="h-6 w-6" />
            {language === "roman-urdu" ? "Shariah-Compliant Nahi Hai" : "Not Shariah Compliant"}
          </CardTitle>
          <Badge variant="not-compliant">{language === "roman-urdu" ? "Non-Halal" : "Non-Halal"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-error-text">
          {language === "roman-urdu"
            ? "Yeh stock Islamic finance ke asoolon par pura nahi utarta aur Shariah-conscious investors ke liye theek nahi hai."
            : "This stock does not meet Islamic finance criteria and is not recommended for Shariah-conscious investors."}
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-error-text">
            <XCircle className="h-4 w-4" />
            <span>
              {language === "roman-urdu" ? "Qarz ki sharah zyada hai" : "High debt ratio"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>
              {language === "roman-urdu" ? "Karobari activities wazeh nahi hain" : "Business activities unclear"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
