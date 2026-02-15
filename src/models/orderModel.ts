import mongoose, { Schema } from "mongoose";
import { IOrder, IOrderItem } from "../validation/orderValidation";

const orderItemSchema = new Schema<IOrderItem>({
    productTitle :{type: String , required: true},
    productImage :{type: String , required: true},
    unitPrice : {type: Number, required: true},
    quantity : {type: Number, required: true}
})

const orderSchema = new Schema<IOrder>({
    orderItems : {type: [orderItemSchema], required: true},
    address : {type: String, required: true},
    total : {type: Number, required: true},
    userId : {type: Schema.Types.ObjectId, ref: "User"}
    
})

export const OrderModel = mongoose.model<IOrder>("Order", orderSchema)