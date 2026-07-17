import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useApp } from "../../contexts/AppContext";
import { WifiOff } from "lucide-react";
import { Badge } from "./Badge";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { backendOnline, language } = useApp();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {!backendOnline && (
          <div className="bg-destructive/10 text-destructive border-b border-destructive/20 px-6 py-2.5 flex items-center justify-between text-xs font-medium gap-2 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 animate-pulse text-destructive" />
              <span>
                {language === "roman-urdu"
                  ? "Backend offline hai. Kuch live data aur features abhi dastiab nahi hain."
                  : "Backend is offline. Live prices and news are currently unavailable."}
              </span>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-destructive/10 text-destructive border-destructive/20">
              {language === "roman-urdu" ? "Mock Data" : "Offline Mode"}
            </Badge>
          </div>
        )}
        <Header />
        <main className="flex-1 overflow-auto p-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ease-out">
          {children}
        </main>
      </div>
    </div>
  );
};
