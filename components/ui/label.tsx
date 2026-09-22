import { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium leading-none text-zinc-800", className)}
      {...props}
    />
  );
}
