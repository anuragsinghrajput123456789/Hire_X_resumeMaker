import * as React from "react"
import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-white/10 bg-[#070B18]/90 px-4 py-3 text-sm text-gray-100 placeholder:text-slate-500 focus:border-[#00F2FE]/60 focus:ring-1 focus:ring-[#00F2FE]/30 focus:shadow-[0_0_20px_rgba(0,242,254,0.15)] transition-all duration-200 ease-out outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
