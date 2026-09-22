import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Checkbox({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn("size-4 rounded border-zinc-300 accent-zinc-950", className)}
      {...props}
    />
  );
}
