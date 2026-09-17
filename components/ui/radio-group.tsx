"use client";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Radio } from "@base-ui/react/radio";
import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return <RadioGroupPrimitive data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />;
}

function RadioGroupItem({ className, ...props }: Radio.Root.Props) {
  return (
    <Radio.Root
      data-slot="radio-group-item"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-card outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[checked]:border-primary disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <Radio.Indicator className="size-2.5 rounded-full bg-primary" />
    </Radio.Root>
  );
}

export { RadioGroup, RadioGroupItem };
