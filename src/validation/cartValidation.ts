import z from "zod";
import { zProductSchema } from "./productValidation";

export const cartStatusEnum = ["active", "complete"] as const;

export const zCartItemSchema = z.object({
  product: zProductSchema,
  unitPrice: z.number().optional(),
  quantity: z.number().default(1),
});
export type ICartItem = z.infer<typeof zCartItemSchema>;

export const zCartSchema = z.object({
  userId: z.string(),
  items: z.array(zCartItemSchema),
  totalAmount: z.number(),
  status: z.enum(cartStatusEnum).default("active"),
});
export type ICart = z.infer<typeof zCartSchema>;
