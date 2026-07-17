import { cn } from "../../lib/utils";
import { HTMLAttributes } from "react";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "info";
}

const iconMap = {
  default: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  destructive: AlertCircle,
  info: Info,
};

export const Alert = ({ className, variant = "default", children, ...props }: AlertProps) => {
  const Icon = iconMap[variant];

  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 flex items-start gap-3",
        {
          "bg-card text-foreground border-border": variant === "default",
          "bg-success/10 text-success border-success/20": variant === "success",
          "bg-warning-background text-warning border-warning-border": variant === "warning",
          "bg-error-background text-error-text border-error-border": variant === "destructive",
          "bg-primary/10 text-primary border-primary/20": variant === "info",
        },
        className
      )}
      {...props}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  );
};
