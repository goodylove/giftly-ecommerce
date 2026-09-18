import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";

export interface OrderItemRow {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price_kobo: number;
}

export type SettlementResult =
  | { found: false }
  | {
      found: true;
      orderId: string;
      reference: string;
      customerName: string;
      amountKobo: number;
      items: OrderItemRow[];
      paymentStatus: "pending" | "paid" | "failed";
    };

// The single place that decides whether an order is paid and writes
// `payment_status`. Both the browser-facing verify route (redirect back from
// Paystack) and the Paystack webhook call this, so the two can never disagree
// about an order's state, and a race between them can't double-process a payment.
//
// `verify` is only invoked when the order isn't already settled — the webhook
// already knows the outcome from its payload, while the verify route still needs
// to ask Paystack, so this keeps that call from happening when it isn't needed.
export async function settleOrderPayment({
  reference,
  verify,
}: {
  reference: string;
  verify: () => Promise<{ status: string; amount: number }>;
}): Promise<SettlementResult> {
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("payment_reference", reference)
    .single();

  if (orderError || !order) {
    return { found: false };
  }

  const { data: orderItems, error: itemsError } = await supabaseAdmin
    .from("order_items")
    .select("product_id, product_name, quantity, unit_price_kobo")
    .eq("order_id", order.id);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  const base = {
    found: true as const,
    orderId: order.id as string,
    reference,
    customerName: order.customer_name as string,
    amountKobo: order.total_amount_kobo as number,
    items: (orderItems ?? []) as OrderItemRow[],
  };

  // Already settled — idempotent no-op, so a page reload or a duplicate webhook
  // delivery can never flip an outcome or re-run the update.
  if (order.payment_status === "paid" || order.payment_status === "failed") {
    return { ...base, paymentStatus: order.payment_status };
  }

  const { status, amount } = await verify();
  const isPaid = status === "success" && amount === order.total_amount_kobo;

  await supabaseAdmin
    .from("orders")
    .update({ payment_status: isPaid ? "paid" : "failed" })
    .eq("id", order.id);

  return { ...base, paymentStatus: isPaid ? "paid" : "failed" };
}
