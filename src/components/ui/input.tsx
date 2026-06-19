import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input h-10 w-full min-w-0 rounded-full border bg-transparent px-4 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "",
        error: "border-[#FF4D4D] text-[#FF4D4D] focus-visible:border-[#FF4D4D] focus-visible:ring-[#FF4D4D]/20 aria-invalid:ring-[#FF4D4D]/20",
        success: "border-[#00FF9D] text-[#00FF9D] focus-visible:border-[#00FF9D] focus-visible:ring-[#00FF9D]/20",
        auth: "h-14 rounded-[18px] border-[#2B3032] bg-[#0D0F10] px-5 py-3 text-[15px] leading-5 text-[#F4F7F8] shadow-none placeholder:text-[#4F565A] aria-invalid:border-[#FF416C] aria-invalid:ring-0 focus-visible:border-[#596165] focus-visible:ring-0 md:h-[58px] md:text-base",
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
