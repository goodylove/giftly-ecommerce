export async function initializePaystackTransaction({
  email,
  amount,
  reference,
}: {
  email: string;
  amount: number;
  reference: string;
}) {
  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          email,
          amount: amount.toString(),
          reference,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      throw new Error(
        `Failed to initialize Paystack transaction: ${data.message}`,
      );
    }

    return data.data;
  } catch (error) {
    console.error("Error initializing Paystack transaction:", error);
    throw error;
  }
}

// Distinct from a generic Error so callers can tell "Paystack itself failed us"
// (worth a 502 + "try again") apart from an unrelated bug (worth a plain 500).
export class PaystackVerificationError extends Error {}

export async function verifyPaystackTransaction(reference: string) {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      throw new PaystackVerificationError(
        `Failed to verify Paystack transaction: ${data.message}`,
      );
    }

    return data.data as { status: string; amount: number; reference: string };
  } catch (error) {
    console.error("Error verifying Paystack transaction:", error);
    throw error instanceof PaystackVerificationError
      ? error
      : new PaystackVerificationError(
          error instanceof Error ? error.message : "Could not reach Paystack",
        );
  }
}
