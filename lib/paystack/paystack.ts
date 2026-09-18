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
