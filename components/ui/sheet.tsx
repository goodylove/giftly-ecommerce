"use client";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      className={cn("font-heading text-sm font-semibold tracking-wide uppercase", className)}
      {...props}
    />
  );
}

export function SheetContent({ className, children, ...props }: DialogPrimitive.Popup.Props) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-zinc-950/35 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
      <DialogPrimitive.Popup
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-card shadow-2xl outline-none transition-transform duration-300 ease-out data-ending-style:translate-x-full data-starting-style:translate-x-full sm:max-w-md",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-5", className)}
      {...props}
    />
  );
}

export function SheetBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex-1 overflow-y-auto px-6 py-5", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("shrink-0 border-t border-border px-6 py-5", className)} {...props} />;
}
