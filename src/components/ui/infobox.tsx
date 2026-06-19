import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react";

type InfoBoxVariant = "info" | "warning" | "info-dark" | "warning-dark";

type InfoBoxProps = {
  title?: string;
  children: React.ReactNode;
  variant?: InfoBoxVariant;
  className?: string;
  hideIcon?: boolean;
};

const variantStyles: Record<InfoBoxVariant, { container: string; iconBg: string; icon: string; text: string; IconComponent: typeof Info }> = {
  info: {
    container: "border-[#487AF6] bg-[#F2F7FE] dark:border-blue-500/50 dark:bg-blue-900/20",
    iconBg: "bg-[radial-gradient(51.56%_51.56%_at_50%_50%,rgba(72,122,246,0.05)_0%,rgba(72,122,246,0.1)_81.91%,rgba(72,122,246,0.2)_100%)]",
    icon: "text-[#487AF6]",
    text: "text-[#0F121A] dark:text-gray-200",
    IconComponent: Info,
  },
  warning: {
    container: "border-[#FFD951] bg-[#FFFBEE] dark:border-yellow-500/50 dark:bg-yellow-900/20",
    iconBg: "bg-[radial-gradient(51.56%_51.56%_at_50%_50%,rgba(255,217,81,0.05)_0%,rgba(255,217,81,0.1)_81.91%,rgba(255,217,81,0.2)_100%)]",
    icon: "text-[#E2B308]",
    text: "text-[#0F121A] dark:text-gray-200",
    IconComponent: AlertTriangle,
  },
  "info-dark": {
    container: "border-[#487AF6]/30 bg-[#487AF6]/10",
    iconBg: "bg-[#487AF6]/20",
    icon: "text-[#7FA6FF]",
    text: "text-gray-200",
    IconComponent: Info,
  },
  "warning-dark": {
    container: "border-[#E2B308]/30 bg-[#E2B308]/10",
    iconBg: "bg-[#E2B308]/20",
    icon: "text-[#F2CB3E]",
    text: "text-gray-200",
    IconComponent: AlertTriangle,
  },
};

function InfoBox({ title, children, variant = "info", className, hideIcon = false }: InfoBoxProps) {
  const { container, iconBg, icon, text, IconComponent } = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 shadow-[0px_14px_50px_-30px_rgba(0,0,0,0.03)]",
        container,
        className
      )}
    >
      <div className="flex items-start gap-4">
        {
          !hideIcon && (
            <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full", iconBg)}>
              <IconComponent className={cn("h-[17px] w-[17px]", icon)} />
            </div>
          )
        }
        <div className="flex-1">
          {title && (
            <p className={cn("mb-2 text-sm font-semibold", (variant === "info-dark" || variant === "warning-dark") ? "text-white" : "text-[#0F121A] dark:text-white")}>{title}</p>
          )}
          <div className={cn("text-[13px] leading-[140%] tracking-[-0.015em]", text)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export { InfoBox };
