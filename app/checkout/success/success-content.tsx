"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon, CircleNotchIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

  if (status === "verifying") {
    return (
      <section className="page-container py-10 md:py-16">
        <div className="mx-auto max-w-lg text-center">
          <CircleNotchIcon size={28} className="mx-auto animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Confirming your payment…</p>
        </div>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="page-container py-10 md:py-16">
        <div className="mx-auto max-w-lg text-center">
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
        </div>
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
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <CheckCircleIcon size={30} weight="duotone" />
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Thank you, {firstName} — your gift is on its way.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Order <Badge variant="outline">{order.orderId}</Badge> is confirmed.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left">
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
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-8 w-full")}>
          Back to shopping
        </Link>
      </div>
    </section>
  );
}
