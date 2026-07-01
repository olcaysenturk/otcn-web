import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Matched to Figma "Inputs" (52609-2849): rounded-12, dark fill, border #3A4043/50;
// focus = white border + soft shadow; error #FF4D6D; success #27E9A6;
// disabled = #5E666A/60 fill, #1F2628 text. Tokens used where available (primary caret).
const inputVariants = cva(
  "placeholder:text-[#5E666A] selection:bg-primary selection:text-primary-foreground h-11 w-full min-w-0 rounded-[12px] border border-[#3A4043]/50 bg-[#0E0F10] px-4 py-2.5 text-sm font-medium text-[#F4F7F8] caret-primary shadow-xs transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:border-[#3A4043] disabled:bg-[rgba(94,102,106,0.6)] disabled:text-[#1F2628] disabled:placeholder:text-[#1F2628] focus-visible:border-[#F4F7F8] focus-visible:shadow-[0px_0px_2px_0px_rgba(62,28,130,0.25)]",
  {
    variants: {
      variant: {
        default: "",
        error: "border-[#FF4D6D] focus-visible:border-[#FF4D6D] focus-visible:shadow-none",
        success: "border-[#27E9A6] focus-visible:border-[#27E9A6] focus-visible:shadow-none",
        auth: "h-14 rounded-[18px] border-[#2B3032] bg-[#0D0F10] px-5 py-3 text-[15px] leading-5 text-[#F4F7F8] shadow-none placeholder:text-[#4F565A] aria-invalid:border-[#FF416C] aria-invalid:ring-0 focus-visible:border-[#596165] focus-visible:shadow-none focus-visible:ring-0 md:h-[58px] md:text-base",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Input({ className, variant, type, ...props }: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
