"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircleIcon, CircleNotchIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SuccessConfetti } from "@/components/ui/success-confetti";
import { type CartItem } from "@/lib/cart";
import { formatNaira, type GiftCardBrand } from "@/lib/gift-cards";
import { cn } from "@/lib/utils";
import { useCart } from "@/app/context/cartProvider";
import { verifyCheckoutPayment, type VerifySuccessResponse } from "@/lib/api/checkout-client";

type VerifyState = "verifying" | "success" | "failed";

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");
  const { clear } = useCart();

  const [status, setStatus] = useState<VerifyState>(reference ? "verifying" : "failed");
  const [result, setResult] = useState<VerifySuccessResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    reference ? null : "No payment reference was found in the URL.",
  );
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || !reference) return;
    hasRun.current = true;

    verifyCheckoutPayment(reference).then((response) => {
      if (response.success) {
        clear();
        setResult(response);
        setStatus("success");
      } else {
        setStatus("failed");
        setErrorMessage(response.error);
      }
    });
  }, [reference, clear]);

  // Each state gets its own key so switching between them replays the entrance.
  const stateMotion = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  };

  if (status === "verifying") {
    return (
      <section className="page-container py-10 md:py-16">
        <motion.div key="verifying" {...stateMotion} className="mx-auto max-w-lg text-center">
          <CircleNotchIcon size={28} className="mx-auto animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Confirming your payment…</p>
        </motion.div>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="page-container py-10 md:py-16">
        <motion.div key="failed" {...stateMotion} className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <WarningCircleIcon size={30} weight="duotone" />
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            We couldn&apos;t confirm your payment
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{errorMessage}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/checkout" className={cn(buttonVariants({ size: "lg" }), "flex-1")}>
              Back to checkout
            </Link>
            <Link href="/" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "flex-1")}>
              Back to shopping
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  const order = result!;
  const firstName = order.customerName.trim().split(/\s+/)[0] ?? "friend";
  const lineItems: CartItem[] = order.items.map((item) => ({
    id: item.productId as GiftCardBrand,
    denomination: item.unitPriceKobo / 100,
    quantity: item.quantity,
  }));

  return (
    <section className="page-container py-10 md:py-16">
      <SuccessConfetti />
      <motion.div key="success" {...stateMotion} className="mx-auto max-w-lg text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.1 }}
          className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-brand-soft text-brand"
        >
          <CheckCircleIcon size={30} weight="duotone" />
        </motion.div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Thank you, {firstName} — your gift is on its way.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          We&apos;ve received your payment — here&apos;s what&apos;s on its way.
        </p>

        <div className="order-summary-panel">
          <div className="order-summary-row">
            <span>Order ID</span>
            <span>{order.orderId}</span>
          </div>
          <div className="order-summary-row">
            <span>Reference</span>
            <span>{order.reference}</span>
          </div>
          <div className="order-summary-row">
            <span>Payment method</span>
            <span>Paystack</span>
          </div>
          <div className="order-summary-row">
            <span>Status</span>
            <Badge variant="brand">Paid</Badge>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-card p-6 text-left">
          <ul className="flex flex-col gap-4">
            {lineItems.map((item, index) => (
              <CartLineItem key={`${item.id}-${item.denomination}-${index}`} item={item} compact />
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Total paid</span>
            <span>{formatNaira(order.amountKobo / 100)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={cn(buttonVariants({ size: "lg" }), "sm:flex-[1.6]")}>
            Back to shopping
          </Link>
          <a
            href="mailto:hello@giftly.example"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "sm:flex-1")}
          >
            Need help?
          </a>
        </div>
      </motion.div>
    </section>
  );
}
