import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "destructive" | "ghost";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-zinc-950 text-white hover:bg-zinc-800",
        variant === "outline" &&
          "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100",
        variant === "destructive" &&
          "border border-red-200 bg-white text-red-700 hover:bg-red-50",
        variant === "ghost" && "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950",
        className,
      )}
      {...props}
    />
  );
}
