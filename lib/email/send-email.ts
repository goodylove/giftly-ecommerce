import "server-only";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  // Lets the provider drop a duplicate send if the same request is retried.
  idempotencyKey?: string;
}

// Sends a transactional email through Resend's HTTP API. Throws on any failure —
// callers decide whether a failed email should matter (for order confirmations it
// must not undo a payment, so they catch and log).
export async function sendEmail({ to, subject, html, text, idempotencyKey }: EmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("Email is not configured: set RESEND_API_KEY and EMAIL_FROM");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
    // A slow mail provider shouldn't hold up the payment response indefinitely.
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Failed to send email (${response.status}): ${detail}`);
  }
}
