"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftIcon, LockSimpleIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatNaira } from "@/lib/gift-cards";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cartProvider";
import { DeliveryDetails, EMAIL_PATTERN, EMPTY_DETAILS } from "@/types/checkout.types";
import { submitCheckout } from "@/lib/api/checkout-client";

export default function CheckoutComponent() {
  const { items, subtotal, count } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [details, setDetails] = useState<DeliveryDetails>(EMPTY_DETAILS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const stepMotion = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
  };

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
      <section className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-md text-center">
          <p className="font-heading text-2xl font-semibold tracking-tight">Your cart is empty</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Add a gift card before checking out.
          </p>
          <Link href="/#gift-cards" className={cn(buttonVariants({ size: "lg" }), "mt-6")}>
            Browse gift cards
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-container py-10 md:py-14">
      <Link href="/cart" className="detail-back">
        <ArrowLeftIcon size={16} /> Back to cart
      </Link>

      <div className="checkout-head">
        <h1 className="section-heading">Checkout</h1>
        <CheckoutSteps currentStep={step} />
      </div>

      <div className="checkout-layout">
        <div>
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.div key="step-1" {...stepMotion} className="checkout-panel">
                <div className="checkout-panel-head">
                  <h2>Delivery details</h2>
                  {/* <p>Gift cards are delivered by email — there&apos;s no shipping address to enter.</p> */}
                </div>

                <div className="checkout-fields">
                  <div className="field">
                    <label htmlFor="senderName">Your name</label>
                    <Input
                      id="senderName"
                      value={details.senderName}
                      onChange={(event) => updateDetail("senderName", event.target.value)}
                      placeholder="Enter your name"
                      autoComplete="name"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="senderEmail">Your email</label>
                    <Input
                      id="senderEmail"
                      type="email"
                      value={details.senderEmail}
                      onChange={(event) => updateDetail("senderEmail", event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-describedby="senderEmail-hint"
                    />
                    {/* <p id="senderEmail-hint" className="field-hint">
                      We send the gift code and receipt here.
                    </p> */}
                  </div>
                  <div className="field field--full">
                    <label htmlFor="message">
                      Gift message <span className="field-optional">optional</span>
                    </label>
                    <Textarea
                      id="message"
                      rows={3}
                      value={details.message}
                      onChange={(event) => updateDetail("message", event.target.value)}
                      placeholder="Happy birthday! Enjoy your gift."
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  size="lg"
                  // A washed-out brand fill reads as broken; go neutral when disabled.
                  className="mt-7 w-full disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
                  disabled={!isStep1Valid}
                  onClick={() => setStep(2)}
                >
                  Continue to review
                </Button>
                {!isStep1Valid && (
                  <p className="mt-2.5 text-center text-xs text-muted-foreground">
                    Add your name and a valid email address to continue.
                  </p>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step-2" {...stepMotion} className="checkout-panel">
                <div className="checkout-panel-head">
                  <h2>Review &amp; payment</h2>
                  <p>Check the details below, then continue to Paystack to pay securely.</p>
                </div>

                <div className="checkout-review">
                  <div className="checkout-review-row">
                    <span>Name</span>
                    <span>{details.senderName}</span>
                  </div>
                  <div className="checkout-review-row">
                    <span>Email</span>
                    <span>{details.senderEmail}</span>
                  </div>
                  {details.message.trim() && (
                    <div className="checkout-review-row">
                      <span>Message</span>
                      <span className="checkout-review-message">
                        &ldquo;{details.message.trim()}&rdquo;
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="checkout-edit"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                  >
                    <PencilSimpleIcon size={13} /> Edit details
                  </button>
                </div>

                <div className="checkout-payment">
                  <LockSimpleIcon size={17} weight="fill" aria-hidden="true" />
                  <p>
                    You&apos;ll be taken to Paystack to finish paying by card, bank transfer or USSD.
                    Your card details never touch Giftly.
                  </p>
                </div>

                <AnimatePresence>
                  {submitError && (
                    <motion.p
                      role="alert"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden text-sm text-destructive"
                    >
                      <span className="mt-5 block">{submitError}</span>
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="sm:flex-1"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    className="sm:flex-[1.6]"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Redirecting to payment…" : `Pay ${formatNaira(subtotal)}`}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Always visible, so the shopper can see what they're paying for at every step. */}
        <aside className="checkout-summary" aria-label="Order summary">
          <div className="checkout-summary-head">
            <h2>Order summary</h2>
            <span>
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>

          <ul className="checkout-summary-items">
            {items.map((item) => (
              <CartLineItem key={`${item.id}-${item.denomination}`} item={item} compact />
            ))}
          </ul>

          <Separator className="my-4" />

          <div className="checkout-summary-row">
            <span>Subtotal</span>
            <span>{formatNaira(subtotal)}</span>
          </div>


          <Separator className="my-4" />

          <div className="checkout-summary-total">
            <span>Total</span>
            <span>{formatNaira(subtotal)}</span>
          </div>

          <p className="checkout-summary-note">
            <LockSimpleIcon size={13} weight="fill" aria-hidden="true" />
            Secured by Paystack
          </p>
        </aside>
      </div>
    </section>
  );
}
