"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCart, type CartItem } from "@/lib/cart";
import { formatNaira } from "@/lib/gift-cards";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type PaymentMethod = "card" | "bank" | "wallet";

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "card", label: "Card" },
  { value: "bank", label: "Bank transfer" },
  { value: "wallet", label: "Wallet" },
];

interface DeliveryDetails {
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
}

const EMPTY_DETAILS: DeliveryDetails = {
  senderName: "",
  senderEmail: "",
  recipientName: "",
  recipientEmail: "",
  message: "",
};

interface PlacedOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  details: DeliveryDetails;
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [details, setDetails] = useState<DeliveryDetails>(EMPTY_DETAILS);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  function updateDetail<K extends keyof DeliveryDetails>(key: K, value: DeliveryDetails[K]) {
    setDetails((current) => ({ ...current, [key]: value }));
  }

  const isStep1Valid =
    details.senderName.trim().length > 0 &&
    EMAIL_PATTERN.test(details.senderEmail) &&
    details.recipientName.trim().length > 0 &&
    EMAIL_PATTERN.test(details.recipientEmail);

  function handlePlaceOrder() {
    const id = `GF-${Date.now().toString(36).toUpperCase()}`;
    setOrder({ id, items, subtotal, details });
    clear();
    setStep(3);
  }

  // Order just placed — show the confirmation even though the cart (cleared above) is now empty.
  if (step === 3 && order) {
    const firstName = order.details.senderName.trim().split(/\s+/)[0] ?? "friend";
    return (
      <section className="page-container py-10 md:py-16">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <CheckCircleIcon size={30} weight="duotone" />
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Thank you, {firstName} — your gift is on its way.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We&apos;ve let {order.details.recipientEmail} know. Order{" "}
            <Badge variant="outline">{order.id}</Badge> is confirmed.
          </p>
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left">
            <ul className="flex flex-col gap-4">
              {order.items.map((item) => (
                <CartLineItem key={item.id} item={item} compact />
              ))}
            </ul>
            <Separator className="my-4" />
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Total paid</span>
              <span>{formatNaira(order.subtotal)}</span>
            </div>
          </div>
          <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-8 w-full")}>
            Back to shopping
          </Link>
        </div>
      </section>
    );
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
      <h1 className="section-heading text-center">Checkout</h1>
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
              <div>
                <label htmlFor="recipientName" className="mb-1.5 block text-sm font-medium">
                  Recipient&apos;s name
                </label>
                <Input
                  id="recipientName"
                  value={details.recipientName}
                  onChange={(event) => updateDetail("recipientName", event.target.value)}
                  placeholder="Who is this for?"
                />
              </div>
              <div>
                <label htmlFor="recipientEmail" className="mb-1.5 block text-sm font-medium">
                  Recipient&apos;s email
                </label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={details.recipientEmail}
                  onChange={(event) => updateDetail("recipientEmail", event.target.value)}
                  placeholder="them@example.com"
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
                <CartLineItem key={item.id} item={item} compact />
              ))}
            </ul>
            <Separator className="my-4" />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatNaira(subtotal)}</span>
            </div>

            <Separator className="my-5" />

            <h2 className="text-sm font-semibold">Payment method</h2>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
              className="mt-3 grid gap-3 sm:grid-cols-3"
            >
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-sm transition-colors",
                    paymentMethod === method.value && "border-primary",
                  )}
                >
                  <RadioGroupItem value={method.value} />
                  {method.label}
                </label>
              ))}
            </RadioGroup>
            <p className="mt-3 text-xs text-muted-foreground">Demo checkout — no real payment is charged.</p>

            <Separator className="my-5" />

            <h2 className="text-sm font-semibold">Delivering to</h2>
            <p className="mt-2 text-sm">
              {details.recipientName} <span className="text-muted-foreground">— {details.recipientEmail}</span>
            </p>
            {details.message && (
              <p className="mt-1 text-sm text-muted-foreground">&ldquo;{details.message}&rdquo;</p>
            )}

            <div className="mt-6 flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="button" size="lg" className="flex-1" onClick={handlePlaceOrder}>
                Place order
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
