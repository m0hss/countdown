"use client";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = AccordionPrimitive.Item;
export function AccordionTrigger({ children }: { children: React.ReactNode }) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger className="accordion-trigger">
        {children}
        <Plus size={18} aria-hidden />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}
export function AccordionContent({ children }: { children: React.ReactNode }) {
  return (
    <AccordionPrimitive.Content className="accordion-content">
      <div>{children}</div>
    </AccordionPrimitive.Content>
  );
}
