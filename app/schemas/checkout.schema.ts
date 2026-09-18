import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),

  customerEmail: z.email("Enter a valid email"),

  items: z
    .array(
      z.object({
        productId: z.string(),
        denomination: z.number().positive(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, "Cart cannot be empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
