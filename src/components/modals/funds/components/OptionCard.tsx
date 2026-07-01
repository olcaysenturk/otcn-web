import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type OptionCardProps = {
  title: string;
  description: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  icon?: string;
  className?: string;
};

export function OptionCard({
  title,
  description,
  active,
  disabled,
  onClick,
  icon,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-start gap-4 rounded-[20px] border p-4 text-left hover:cursor-pointer hover:border-[#7C6CF6]/40 hover:bg-white/[0.07] transition-all duration-200 border-white/10 bg-white/5 ",
        disabled && "cursor-default! bg-white/[0.02] opacity-50 hover:border-white/10 hover:bg-white/[0.02]"
      )}
    >
      {icon ? (
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/15",
            disabled && "opacity-50"
          )}
        >
          <img src={icon} alt={title} className="h-5 w-5" />
        </div>
      ) : (
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/15",
            active && "text-[#A78BFA]"
          )}
        >
          {active && <Check className="h-4 w-4 text-[#A78BFA]" />}
        </span>
      )}
      <div className={cn("flex flex-col gap-1", disabled && "opacity-50")}>
        <p className="text-sm font-medium tracking-[-0.015em] text-white">{title}</p>
        <p className="text-[13px] leading-[140%] tracking-[-0.015em] text-gray-400">{description}</p>
      </div>
    </button>
  );
}
