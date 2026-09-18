"use client";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { PlusIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return <AccordionPrimitive.Item className={cn("accordion-item", className)} {...props} />;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="accordion-header">
      <AccordionPrimitive.Trigger className={cn("accordion-trigger", className)} {...props}>
        <span>{children}</span>
        <PlusIcon size={18} weight="bold" className="accordion-icon" aria-hidden="true" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionPanel({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel className={cn("accordion-panel", className)} {...props}>
      <div className="accordion-panel-inner">{children}</div>
    </AccordionPrimitive.Panel>
  );
}
