import z from "zod";
import { Types } from "mongoose";

export const cartStatusEnum = ["active", "complete"] as const;

export const zCartItemSchema = z.object({
  productId: z.string() || z.instanceof(Types.ObjectId),
  unitPrice: z.number(),
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
