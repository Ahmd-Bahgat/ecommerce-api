import mongoose, {Schema} from 'mongoose'
import { cartStatusEnum, ICart , ICartItem} from '../validation/cartValidation'

const cartItemSchema = new mongoose.Schema<ICartItem>({
    product : {type: Schema.Types.ObjectId, ref: "Product", required: true},
    unitPrice : {type: Number, required: true},
    quantity : {type: Number, required: true, default: 1}
})

const cartSchema = new mongoose.Schema<ICart>({
    userId : {type: String, required: true},
    items : [cartItemSchema],
    totalAmount : {type: Number, required: true},
    status : {type: String, enum: cartStatusEnum, default: "active"}
})

export const CartModel = mongoose.model<ICart>("Cart", cartSchema)