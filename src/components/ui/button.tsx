import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20  aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-gradient-button text-primary-foreground hover:from-[#2D1460] hover:to-[#8D52E8] shadow-md border-t border-white/20",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-foreground hover:ring-2 hover:ring-foreground/25",
        secondary:
          "bg-gradient-to-r from-[#F3EFFF] to-[#CDBDFF] text-[#3E1C82] hover:opacity-90 border-0",
        link: "text-primary underline-offset-4 hover:underline",
        green: "border border-[#25B88A] text-[#25B88A] shadow-[0_0_15px_rgba(37,184,138,0.3)] bg-transparent hover:bg-[#25B88A] hover:text-white  transition-all duration-300",
        dark: "bg-neutral-900 text-white hover:ring-2 hover:ring-foreground/25 focus-visible:ring-neutral-900/20",
        glow: "border border-[#00FF9D] text-[#00FF9D] shadow-[0_0_15px_rgba(0,255,157,0.3)] bg-transparent hover:bg-[#00FF9D] hover:text-[#1a1b23] hover:font-bold hover:shadow-[0_0_40px_rgba(0,255,157,0.7)] transition-all duration-300",
        "glow-destructive": "border border-[#FF4D4D] text-[#FF4D4D] shadow-[0_0_15px_rgba(255,77,77,0.3)] bg-transparent hover:bg-[#FF4D4D] hover:text-white hover:shadow-[0_0_40px_rgba(255,77,77,0.7)] transition-all duration-300",
        "glow-red": "border border-[#FF4D4D] text-[#FF4D4D] shadow-[0_0_15px_rgba(255,77,77,0.3)] bg-transparent hover:bg-[#FF4D4D] hover:text-white hover:shadow-[0_0_40px_rgba(255,77,77,0.7)] transition-all duration-300",
        "glow-green": "border border-[#00FF9D] text-[#00FF9D] shadow-[0_0_15px_rgba(0,255,157,0.3)] bg-transparent hover:bg-[#00FF9D] hover:text-[#1a1b23] hover:font-bold hover:shadow-[0_0_40px_rgba(0,255,157,0.7)] transition-all duration-300",
      },
      size: {
        default: "h-9 min-w-[113px] px-4 py-2 has-[>svg]:px-3 text-sm",
        sm: "h-8 rounded-full min-w-[80px] gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-10 rounded-full min-w-[130px] px-8 has-[>svg]:px-6 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        xl: "h-12 rounded-full min-w-[130px] px-8 text-sm",
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
