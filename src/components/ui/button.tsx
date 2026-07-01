import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

// Matched to Figma "Button" (52609-3090) + "Para çek yatır" (52609-3286).
// `size` is declared before `variant` so variant classes win in the merged
// className — letting the pill `glow-*` (para çek/yatır) variants override the
// per-size corner radius (xsmall 8px / s-m 12px / m-l 16px).
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      size: {
        sm: "h-8 rounded-lg px-3.5 has-[>svg]:px-3 text-xs",
        default: "h-9 rounded-xl px-4 has-[>svg]:px-3.5 text-sm",
        lg: "h-11 rounded-2xl px-5 has-[>svg]:px-4 text-sm",
        xl: "h-12 rounded-2xl px-6 text-base",
        icon: "size-9 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-11 rounded-2xl",
      },
      variant: {
        // Primary — Solid orange
        default:
          "bg-primary text-primary-foreground shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.05)] hover:bg-[#E63510] focus-visible:ring-primary/30",
        // Destructive — solid red
        destructive:
          "bg-destructive text-white hover:opacity-90 focus-visible:ring-destructive/30",
        // Secondary — Bordered (white outline, transparent)
        outline:
          "border border-[#F4F7F8] bg-transparent text-[#F4F7F8] hover:bg-white/5 focus-visible:ring-white/20",
        // Secondary — Solid white
        secondary:
          "bg-[#F4F7F8] text-[#0E0F10] hover:bg-white hover:shadow-[0px_1px_2px_1px_rgba(21,21,20,0.4)] focus-visible:ring-white/30",
        link: "text-primary underline-offset-4 hover:underline",
        green:
          "border border-[#27E9A6] bg-transparent text-[#27E9A6] hover:bg-[#27E9A6] hover:text-[#0E0F10] transition-all",
        dark: "border border-[#3A4043] bg-[#0E0F10] text-[#F4F7F8] hover:bg-[#161A1B]",
        // Para Yatır — green pill
        glow:
          "rounded-full border-2 border-[#27E9A6] bg-[#0F121A]/15 text-white hover:bg-[#27E9A6] hover:text-[#0E0F10] transition-colors",
        "glow-green":
          "rounded-full border-2 border-[#27E9A6] bg-[#0F121A]/15 text-white hover:bg-[#27E9A6] hover:text-[#0E0F10] transition-colors",
        // Para Çek — red pill
        "glow-destructive":
          "rounded-full border-2 border-[#FF4D6D] bg-[#0F121A]/15 text-white hover:bg-[#FF4D6D] hover:text-[#0E0F10] transition-colors",
        "glow-red":
          "rounded-full border-2 border-[#FF4D6D] bg-[#0F121A]/15 text-white hover:bg-[#FF4D6D] hover:text-[#0E0F10] transition-colors",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
