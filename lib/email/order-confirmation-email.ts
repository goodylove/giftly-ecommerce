import "server-only";
import { formatNaira } from "@/lib/gift-cards";

export interface OrderConfirmationInput {
  customerName: string;
  orderId: string;
  reference: string;
  items: {
    product_name: string;
    quantity: number;
    unit_price_kobo: number;
  }[];
  totalKobo: number;
  paidAt: Date;
}

const BRAND = "#e11d48";
const INK = "#18181b";
const MUTED = "#71717a";
const BORDER = "#e4e4e7";
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const naira = (kobo: number) => formatNaira(kobo / 100);

function formatPaidAt(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  }).format(date);
}

// Email clients ignore external stylesheets and most modern CSS, so this is a
// table layout with every style inlined, kept to a single 600px column.
export function buildOrderConfirmationEmail(order: OrderConfirmationInput) {
  const firstName = order.customerName.trim().split(/\s+/)[0] || "there";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const supportEmail = process.env.SUPPORT_EMAIL;
  const paidAt = formatPaidAt(order.paidAt);
  const total = naira(order.totalKobo);

  const subject = "Your Giftly order is confirmed";
  const preheader = `We've received your payment of ${total}. Here's your order summary.`;

  const itemRows = order.items
    .map(
      (item) => `
              <tr>
                <td style="padding:14px 0;border-bottom:1px solid ${BORDER};font-family:${FONT};font-size:15px;line-height:22px;color:${INK};">
                  <strong style="font-weight:600;">${escapeHtml(item.product_name)}</strong><br>
                  <span style="font-size:13px;color:${MUTED};">${naira(item.unit_price_kobo)} &times; ${item.quantity}</span>
                </td>
                <td align="right" valign="top" style="padding:14px 0;border-bottom:1px solid ${BORDER};font-family:${FONT};font-size:15px;line-height:22px;color:${INK};white-space:nowrap;">
                  ${naira(item.unit_price_kobo * item.quantity)}
                </td>
              </tr>`,
    )
    .join("");

  const detailRow = (label: string, value: string, mono = false) => `
              <tr>
                <td valign="top" style="padding:6px 16px 6px 0;font-family:${FONT};font-size:13px;line-height:20px;color:${MUTED};white-space:nowrap;">${label}</td>
                <td style="padding:6px 0;font-family:${mono ? "'SFMono-Regular',Consolas,'Liberation Mono',monospace" : FONT};font-size:13px;line-height:20px;color:${INK};word-break:break-all;">${value}</td>
              </tr>`;

  const cta = appUrl
    ? `
          <tr>
            <td align="center" style="padding:8px 32px 32px;">
              <a href="${escapeHtml(appUrl)}" style="display:inline-block;padding:13px 28px;border-radius:10px;background:${BRAND};font-family:${FONT};font-size:15px;font-weight:600;line-height:20px;color:#ffffff;text-decoration:none;">Continue shopping</a>
            </td>
          </tr>`
    : "";

  const help = supportEmail
    ? `Questions about your order? Contact us at <a href="mailto:${escapeHtml(supportEmail)}" style="color:${BRAND};text-decoration:none;">${escapeHtml(supportEmail)}</a>.`
    : "Questions about your order? Just reply to this email.";

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
            <tr>
              <td align="center" style="padding:0 0 20px;font-family:${FONT};font-size:24px;font-weight:700;letter-spacing:-0.5px;color:${BRAND};">Giftly</td>
            </tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${BORDER};border-radius:16px;overflow:hidden;">
            <tr><td style="height:4px;line-height:4px;font-size:0;background:${BRAND};">&nbsp;</td></tr>
            <tr>
              <td style="padding:36px 32px 8px;font-family:${FONT};">
                <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:${BRAND};">Payment received</p>
                <h1 style="margin:0 0 12px;font-size:24px;line-height:32px;font-weight:700;letter-spacing:-0.3px;color:${INK};">Thank you, ${escapeHtml(firstName)}.</h1>
                <p style="margin:0;font-size:15px;line-height:24px;color:${MUTED};">Your payment was successful and your order is confirmed. Keep this email as your receipt.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td colspan="2" style="padding:0 0 6px;border-bottom:2px solid ${INK};font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:${INK};">Order summary</td>
                  </tr>${itemRows}
                  <tr>
                    <td style="padding:16px 0 0;font-family:${FONT};font-size:16px;font-weight:700;color:${INK};">Total paid</td>
                    <td align="right" style="padding:16px 0 0;font-family:${FONT};font-size:18px;font-weight:700;color:${INK};white-space:nowrap;">${total}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid ${BORDER};border-radius:12px;">
                  <tr>
                    <td style="padding:16px 20px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRow("Order ID", escapeHtml(order.orderId), true)}${detailRow("Reference", escapeHtml(order.reference), true)}${detailRow("Paid on", escapeHtml(paidAt))}${detailRow("Payment method", "Paystack")}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>${cta}
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
            <tr>
              <td align="center" style="padding:24px 16px 0;font-family:${FONT};font-size:12px;line-height:20px;color:${MUTED};">
                ${help}<br>
                &copy; ${order.paidAt.getFullYear()} Giftly. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `Thank you, ${firstName}.`,
    "",
    "Your payment was successful and your order is confirmed. Keep this email as your receipt.",
    "",
    "ORDER SUMMARY",
    ...order.items.map(
      (item) =>
        `- ${item.product_name}: ${naira(item.unit_price_kobo)} x ${item.quantity} = ${naira(item.unit_price_kobo * item.quantity)}`,
    ),
    "",
    `Total paid: ${total}`,
    "",
    `Order ID: ${order.orderId}`,
    `Reference: ${order.reference}`,
    `Paid on: ${paidAt}`,
    "Payment method: Paystack",
    "",
    supportEmail
      ? `Questions about your order? Contact us at ${supportEmail}.`
      : "Questions about your order? Just reply to this email.",
    "",
    "Giftly",
  ].join("\n");

  return { subject, html, text };
}
