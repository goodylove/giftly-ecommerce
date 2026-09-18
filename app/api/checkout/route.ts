import { NextResponse } from "next/server";
import { checkoutSchema } from "@/app/schemas/checkout.schema";
import { supabaseAdmin } from "@/lib/supabase/server";
import { GiftCard, giftCards } from "@/lib/gift-cards";
import { initializePaystackTransaction } from "@/lib/paystack/paystack";

// Post request handler for the checkout API route

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = checkoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.format() },
        { status: 400 },
      );
    }

    const { customerName, customerEmail, items } = result.data;

    let totalAmountKobo = 0;

    const orderItems = items?.map((item) => {
      const product = giftCards.find(
        (card: GiftCard) => card.id === item.productId,
      );

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (!product.denominations.includes(item.denomination)) {
        throw new Error(`Invalid denomination for ${product.name}`);
      }

      const unitPriceInKobo = item.denomination * 100;
      totalAmountKobo += unitPriceInKobo * item.quantity;

      return {
        product_id: item.productId,
        product_name: product.name,
        // denomination: item.denomination,
        quantity: item.quantity,
        unit_price_kobo: unitPriceInKobo,
      };
    });

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        total_amount_kobo: totalAmountKobo,
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { success: false, error: orderError.message },
        { status: 500 },
      );
    }

    const paymentReference = `giftly_${order.id}`;

    const { error: referenceError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_reference: paymentReference,
      })
      .eq("id", order.id);

    if (referenceError) {
      throw referenceError;
    }

    const itemsToInsert = orderItems?.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: orderItemsError } = await supabaseAdmin
      .from("order_items")
      .insert(itemsToInsert);

    if (orderItemsError) {
      throw orderItemsError;
    }

    const payment = await initializePaystackTransaction({
      email: customerEmail,
      amount: totalAmountKobo,
      reference: paymentReference,
    });

    // Return a success response with the order ID and total amount in kobo
    return NextResponse.json({
      success: true,
      orderId: order.id,
      reference: paymentReference,
      authorizationUrl: payment.authorization_url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
