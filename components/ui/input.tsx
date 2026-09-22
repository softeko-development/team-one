import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-10 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-900/10 transition-shadow focus:border-zinc-500 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
