import { User, Wallet } from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useApp } from "../../contexts/AppContext";
import { Badge } from "./Badge";

export const Header = () => {
  const { dummyBalance } = useApp();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="h-14 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="text-sm text-muted-foreground">{today}</div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className="hidden sm:flex items-center gap-2 px-4 py-1.5 font-extrabold border-primary/30 bg-primary/10 text-primary text-sm shadow-sm rounded-full">
          <Wallet className="w-4 h-4" />
          PKR {dummyBalance.toLocaleString()}
        </Badge>
        <LanguageSwitcher />
        <DarkModeToggle />
        <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
          <User className="h-4 w-4 text-primary" />
        </button>
      </div>
    </header>
  );
};
