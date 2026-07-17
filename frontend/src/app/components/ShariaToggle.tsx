import { useState } from "react";
import { cn } from "../../lib/utils";
import { useApp } from "../../contexts/AppContext";

interface ShariaToggleProps {
  onToggle?: (enabled: boolean) => void;
  defaultEnabled?: boolean;
  checked?: boolean;
  onChange?: (enabled: boolean) => void;
}

export const ShariaToggle = ({ onToggle, defaultEnabled = false, checked, onChange }: ShariaToggleProps) => {
  const { language } = useApp();
  const [internalEnabled, setInternalEnabled] = useState(defaultEnabled);
  const isControlled = checked !== undefined;
  const enabled = isControlled ? checked : internalEnabled;

  const handleToggle = () => {
    const newValue = !enabled;
    if (!isControlled) {
      setInternalEnabled(newValue);
    }
    onToggle?.(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-shariah-background border border-shariah-border">
      <span className="text-xl">☪️</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">
          {language === "roman-urdu" ? "Shariah Filter" : "Shariah Filter"}
        </p>
        <p className="text-xs text-muted-foreground">
          {language === "roman-urdu" ? "Sirf compliant stocks dikhayein" : "Show only compliant stocks"}
        </p>
      </div>
      <button
        onClick={handleToggle}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          enabled ? "bg-shariah-accent" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
};
