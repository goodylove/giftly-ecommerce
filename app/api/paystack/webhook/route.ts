import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { settleOrderPayment } from "@/lib/orders/settle-payment";

interface PaystackChargeEvent {
  event: string;
  data?: {
    reference?: string;
    status?: string;
    amount?: number;
  };
}

// Paystack calls this directly, independent of the shopper's browser — this is
// what settles an order if they pay and close the tab before the redirect back
// to /checkout/success completes, which the browser-only verify flow can't cover.
export async function POST(request: Request) {
  const signature = request.headers.get("x-paystack-signature");
  const rawBody = await request.text();

  if (!signature || !hasValidSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PaystackChargeEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Other event types (transfers, subscriptions, etc.) aren't part of this
  // checkout flow — acknowledge them so Paystack doesn't retry, but do nothing.
  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const { reference, status, amount } = event.data ?? {};
  if (!reference || !status || typeof amount !== "number") {
    return NextResponse.json({ error: "Malformed event data" }, { status: 400 });
  }

  const result = await settleOrderPayment({
    reference,
    verify: async () => ({ status, amount }),
  });

  if (!result.found) {
    // The order may not be written yet if this webhook races our own checkout
    // request. A non-2xx tells Paystack to retry with backoff instead of
    // silently dropping a payment we have no record of.
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ received: true });
}

function hasValidSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return false;

  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const providedBuffer = Buffer.from(signature, "utf8");

  return (
    expectedBuffer.length === providedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  );
}
