"use client";
import { useState } from "react";
import Link from "next/link";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatNaira } from "@/lib/gift-cards";
import { cn } from "@/lib/utils";
import { useCart } from "@/app/context/cartProvider";
import { DeliveryDetails, EMAIL_PATTERN, EMPTY_DETAILS } from "@/types/checkout.types";
import { submitCheckout } from "@/lib/api/checkout-client";

export default function CheckoutComponent() {
  const { items, subtotal } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [details, setDetails] = useState<DeliveryDetails>(EMPTY_DETAILS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateDetail<K extends keyof DeliveryDetails>(key: K, value: DeliveryDetails[K]) {
    setDetails((current) => ({ ...current, [key]: value }));
  }

  const isStep1Valid =
    details.senderName.trim().length > 0 &&
    EMAIL_PATTERN.test(details.senderEmail);

  async function handlePlaceOrder() {
    setSubmitError(null);
    setIsSubmitting(true);

    const result = await submitCheckout({
      customerName: details.senderName,
      customerEmail: details.senderEmail,
      // details.message (gift message) has no field in the backend's checkoutSchema yet,
      // so it isn't sent — that's a pre-existing gap in the API contract, not this mapping.
      items: items.map((item) => ({
        productId: item.id,
        denomination: item.denomination,
        quantity: item.quantity,
      })),
    });

    if (!result.success) {
      setSubmitError(result.error);
      setIsSubmitting(false);
      return;
    }

    // Not clearing the cart here on purpose — only /checkout/success clears it, once
    // payment is actually verified, so an abandoned or declined payment doesn't lose it.
    window.location.href = result.authorizationUrl;
  }

  if (items.length === 0) {
    return (
      <section className="page-container py-10 md:py-16">
        <div className="mx-auto max-w-md text-center">
          <p className="font-heading text-2xl font-semibold tracking-tight">Your cart is empty</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Add a gift card before checking out.</p>
          <Link href="/#gift-cards" className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}>
            Browse gift cards
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-container py-10 md:py-16">
      <h1 className="section-heading text-center mb-2">Checkout</h1>
      <CheckoutSteps currentStep={step} />

      <div className="mx-auto max-w-xl">
        {step === 1 && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold">Delivery details</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Gift cards are delivered by email — no shipping address needed.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="senderName" className="mb-1.5 block text-sm font-medium">
                  Your name
                </label>
                <Input
                  id="senderName"
                  value={details.senderName}
                  onChange={(event) => updateDetail("senderName", event.target.value)}
                  placeholder="Ada Lovelace"
                />
              </div>
              <div>
                <label htmlFor="senderEmail" className="mb-1.5 block text-sm font-medium">
                  Your email
                </label>
                <Input
                  id="senderEmail"
                  type="email"
                  value={details.senderEmail}
                  onChange={(event) => updateDetail("senderEmail", event.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                Gift message <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <Textarea
                id="message"
                value={details.message}
                onChange={(event) => updateDetail("message", event.target.value)}
                placeholder="Happy birthday! Enjoy your gift."
              />
            </div>

            <Button
              type="button"
              size="lg"
              className="mt-6 w-full"
              disabled={!isStep1Valid}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold">Order summary</h2>
            <ul className="mt-4 flex flex-col gap-4">
              {items.map((item) => (
                <CartLineItem key={`${item.id}-${item.denomination}`} item={item} compact />
              ))}
            </ul>
            <Separator className="my-4" />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatNaira(subtotal)}</span>
            </div>

            {submitError && (
              <p role="alert" className="mt-4 text-sm text-destructive">
                {submitError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button type="button" size="lg" className="flex-1" onClick={handlePlaceOrder} disabled={isSubmitting}>
                {isSubmitting ? "Redirecting to payment..." : "Place order"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
