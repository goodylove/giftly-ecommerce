import { Suspense } from "react";
import { CircleNotchIcon } from "@phosphor-icons/react/ssr";
import { CheckoutSuccessContent } from "./success-content";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessFallback() {
  return (
    <section className="page-container py-10 md:py-16">
      <div className="mx-auto max-w-lg text-center">
        <CircleNotchIcon size={28} className="mx-auto animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
      </div>
    </section>
  );
}
