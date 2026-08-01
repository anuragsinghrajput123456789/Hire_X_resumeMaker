import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:glass-card group-[.toaster]:bg-[#070B18]/95 group-[.toaster]:text-slate-100 group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:backdrop-blur-xl",
          description: "group-[.toast]:text-slate-400 font-medium text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl font-bold",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
