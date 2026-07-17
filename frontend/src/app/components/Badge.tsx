import { cn } from "../../lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "shariah" | "not-compliant" | "secondary" | "outline";
}

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-primary/10 text-primary": variant === "default",
          "bg-success/10 text-success": variant === "success",
          "bg-warning/10 text-warning": variant === "warning",
          "bg-destructive/10 text-destructive": variant === "destructive",
          "bg-shariah-background text-shariah-text border border-shariah-border": variant === "shariah",
          "bg-error-background text-error-text border border-error-border": variant === "not-compliant",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "border border-border bg-transparent text-muted-foreground": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
};
