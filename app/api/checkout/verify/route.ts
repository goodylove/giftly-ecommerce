import { NextResponse } from "next/server";
import { PaystackVerificationError, verifyPaystackTransaction } from "@/lib/paystack/paystack";
import { settleOrderPayment } from "@/lib/orders/settle-payment";

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
    const result = await settleOrderPayment({
      reference,
      verify: () => verifyPaystackTransaction(reference),
    });

    if (!result.found) {
      return NextResponse.json(
        { success: false, error: "Order not found for this reference" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: result.paymentStatus === "paid",
      orderId: result.orderId,
      reference: result.reference,
      customerName: result.customerName,
      amountKobo: result.amountKobo,
      items: result.items.map((item) => ({
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        unitPriceKobo: item.unit_price_kobo,
      })),
      ...(result.paymentStatus !== "paid" ? { error: "Payment was not completed" } : {}),
    });
  } catch (error) {
    // verify() throws PaystackVerificationError when the Paystack API call itself
    // fails (network/5xx) — leave payment_status as "pending" so a later refresh
    // can retry instead of a transient error permanently marking the order failed.
    if (error instanceof PaystackVerificationError) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not verify payment with Paystack right now. Please refresh in a moment.",
        },
        { status: 502 },
      );
    }

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
