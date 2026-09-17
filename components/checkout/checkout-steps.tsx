import { CheckIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

const STEPS = ["Delivery details", "Review & payment", "Confirmation"];

export function CheckoutSteps({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <ol className="checkout-steps">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const done = stepNumber < currentStep;
        const active = stepNumber === currentStep;
        return (
          <li
            key={label}
            className={cn("checkout-step", active && "checkout-step--active", done && "checkout-step--done")}
          >
            <span className="checkout-step-number">
              {done ? <CheckIcon weight="bold" size={14} /> : stepNumber}
            </span>
            <span className="checkout-step-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
