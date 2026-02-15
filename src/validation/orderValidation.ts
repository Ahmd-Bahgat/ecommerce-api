import { Types } from "mongoose";
import z from "zod";

export const zOrderItemSchema = z.object({
  productTitle: z.string(),
  productImage: z.string(),
  unitPrice: z.number(),
  quantity: z.number(),
});

export type IOrderItem = z.infer<typeof zOrderItemSchema>;

export const zOrderSchema = z.object({
  orderItems: z.array(zOrderItemSchema),
  address: z.string(),
  total: z.number(),
  userId: z.string() || z.instanceof(Types.ObjectId),
});

export type IOrder = z.infer<typeof zOrderSchema>;
