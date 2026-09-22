"use client";

import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: DialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 px-4 py-8 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? "dialog-description" : undefined}
      onClick={() => onOpenChange(false)}
    >
      <div
        className={cn(
          "w-full max-w-2xl rounded-md border border-zinc-200 bg-white p-6 shadow-xl",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="dialog-title" className="text-xl font-semibold tracking-tight text-zinc-950">
              {title}
            </h2>
            {description ? (
              <p id="dialog-description" className="mt-1 text-sm text-zinc-600">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md px-2 py-1 text-xl leading-none text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close dialog"
          >
            x
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
