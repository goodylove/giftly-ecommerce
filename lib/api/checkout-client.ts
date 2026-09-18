export interface CheckoutRequestItem {
  productId: string;
  denomination: number;
  quantity: number;
}

export interface CheckoutRequestPayload {
  customerName: string;
  customerEmail: string;
  items: CheckoutRequestItem[];
}

export interface CheckoutSuccessResponse {
  success: true;
  orderId: string;
  reference: string;
  authorizationUrl: string;
}

export interface CheckoutFailureResponse {
  success: false;
  error: string;
}

export async function submitCheckout(
  payload: CheckoutRequestPayload,
): Promise<CheckoutSuccessResponse | CheckoutFailureResponse> {
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body: unknown = await response.json().catch(() => null);

    if (!response.ok || !body || typeof body !== "object" || !(body as { success?: unknown }).success) {
      return { success: false, error: extractErrorMessage(body) };
    }

    return body as CheckoutSuccessResponse;
  } catch {
    return { success: false, error: "Could not reach the server. Check your connection and try again." };
  }
}

// The existing POST /api/checkout route returns three different shapes depending on
// where it fails: a zod .format() tree (400), a plain string `error` (500), or a
// `message` string with no `success` key at all (thrown-error catch branch, 500).
function extractErrorMessage(body: unknown): string {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    if ("error" in record) {
      const err = record.error;
      if (typeof err === "string") return err;
      if (err && typeof err === "object") {
        const found = findFirstZodMessage(err as Record<string, unknown>);
        if (found) return found;
      }
    }
    if (typeof record.message === "string") return record.message;
  }
  return "Something went wrong placing your order. Please try again.";
}

function findFirstZodMessage(node: Record<string, unknown>): string | undefined {
  const errors = node._errors;
  if (Array.isArray(errors) && errors.length > 0) return String(errors[0]);
  for (const value of Object.values(node)) {
    if (value && typeof value === "object") {
      const found = findFirstZodMessage(value as Record<string, unknown>);
      if (found) return found;
    }
  }
  return undefined;
}

export interface VerifyOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceKobo: number;
}

export interface VerifySuccessResponse {
  success: true;
  orderId: string;
  reference: string;
  customerName: string;
  amountKobo: number;
  items: VerifyOrderItem[];
}

export interface VerifyFailureResponse {
  success: false;
  error: string;
}

export async function verifyCheckoutPayment(
  reference: string,
): Promise<VerifySuccessResponse | VerifyFailureResponse> {
  try {
    const response = await fetch(`/api/checkout/verify?reference=${encodeURIComponent(reference)}`);
    const body: unknown = await response.json().catch(() => null);

    if (!body || typeof body !== "object" || !(body as { success?: unknown }).success) {
      const error =
        body && typeof body === "object" && typeof (body as Record<string, unknown>).error === "string"
          ? ((body as Record<string, unknown>).error as string)
          : "Could not verify your payment.";
      return { success: false, error };
    }

    return body as VerifySuccessResponse;
  } catch {
    return { success: false, error: "Could not reach the server to confirm your payment." };
  }
}
