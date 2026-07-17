import { LayoutDashboard, Search, MessageSquare, Briefcase, TrendingUp, CreditCard, User, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import { Link, useLocation, useNavigate } from "react-router";
import { useApp } from "../../contexts/AppContext";

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, t, language } = useApp();

  const navigation = [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("screener"), href: "/screener", icon: Search },
    { name: t("aiRahbar"), href: "/ai-rahbar", icon: MessageSquare },
    { name: t("portfolio"), href: "/portfolio", icon: Briefcase },
    { name: t("dividends"), href: "/dividends", icon: TrendingUp },
    { name: t("subscription"), href: "/subscription", icon: CreditCard },
    { name: language === "roman-urdu" ? "Mera Profile" : "My Profile", href: "/profile", icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-60 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">FinzyX</h1>
        <p className="text-xs text-muted-foreground">
          {language === "roman-urdu" ? "AI Investment Advisor" : "AI Investment Advisor"}
        </p>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/8 dark:bg-primary/15 text-primary border-l-2 border-primary rounded-l-none rounded-r-lg font-semibold pl-2.5"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground hover:pl-4"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200", isActive && "scale-105")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{currentUser?.email || ""}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 hover:pl-4 rounded-lg transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </div>
    </aside>
  );
};
