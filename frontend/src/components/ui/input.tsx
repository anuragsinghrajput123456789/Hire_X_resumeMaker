import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/10 bg-[#070B18]/90 px-4 py-2.5 text-sm text-gray-100 placeholder:text-slate-500 focus:border-[#00F2FE]/60 focus:ring-1 focus:ring-[#00F2FE]/30 focus:shadow-[0_0_20px_rgba(0,242,254,0.15)] transition-all duration-200 ease-out outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
