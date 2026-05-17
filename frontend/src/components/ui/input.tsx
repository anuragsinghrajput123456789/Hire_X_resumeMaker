import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/5 bg-[#0A0F1D]/85 px-4 py-3 text-sm text-gray-100 placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all duration-300 ease-out outline-none disabled:cursor-not-allowed disabled:opacity-50",
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
