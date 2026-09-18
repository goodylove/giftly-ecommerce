import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { verifyPaystackTransaction } from "@/lib/paystack/paystack";

interface OrderItemRow {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price_kobo: number;
}

// Post request handler for verifying a checkout payment after the Paystack redirect

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { success: false, error: "Missing reference" },
      { status: 400 },
    );
  }

  try {
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("payment_reference", reference)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found for this reference" },
        { status: 404 },
      );
    }

    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("product_id, product_name, quantity, unit_price_kobo")
      .eq("order_id", order.id);

    if (itemsError) {
      return NextResponse.json(
        { success: false, error: itemsError.message },
        { status: 500 },
      );
    }

    const respond = (paymentStatus: string) =>
      NextResponse.json({
        success: paymentStatus === "paid",
        orderId: order.id,
        reference,
        customerName: order.customer_name,
        amountKobo: order.total_amount_kobo,
        items: ((orderItems ?? []) as OrderItemRow[]).map((item) => ({
          productId: item.product_id,
          productName: item.product_name,
          quantity: item.quantity,
          unitPriceKobo: item.unit_price_kobo,
        })),
        ...(paymentStatus !== "paid" ? { error: "Payment was not completed" } : {}),
      });

    // Already settled — don't re-verify with Paystack or flip the result on a page reload.
    if (order.payment_status === "paid" || order.payment_status === "failed") {
      return respond(order.payment_status);
    }

    let verification;
    try {
      verification = await verifyPaystackTransaction(reference);
    } catch {
      // Leave payment_status as "pending" so a later refresh can retry verification
      // instead of a transient Paystack/network error permanently marking the order failed.
      return NextResponse.json(
        {
          success: false,
          error: "Could not verify payment with Paystack right now. Please refresh in a moment.",
        },
        { status: 502 },
      );
    }

    const isPaid =
      verification.status === "success" && verification.amount === order.total_amount_kobo;

    await supabaseAdmin
      .from("orders")
      .update({ payment_status: isPaid ? "paid" : "failed" })
      .eq("id", order.id);

    return respond(isPaid ? "paid" : "failed");
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
