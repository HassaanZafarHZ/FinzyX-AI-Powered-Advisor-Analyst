import { cn } from "../../lib/utils";
import { useApp, Language } from "../../contexts/AppContext";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useApp();

  const langs: { value: Language; label: string }[] = [
    { value: "english", label: "EN" },
    { value: "roman-urdu", label: "ROM" },
  ];

  return (
    <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
      {langs.map((lang) => (
        <button
          key={lang.value}
          onClick={() => setLanguage(lang.value)}
          title={lang.value === "english" ? "English" : "Roman Urdu"}
          className={cn(
            "px-3 py-1 rounded-md text-xs font-medium transition-colors",
            language === lang.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
