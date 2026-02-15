import mongoose, { Schema, Types } from "mongoose";
import { ICart, ICartItem } from "../types/cart.types";

const cartItemSchema = new Schema<ICartItem>({
  product: { type: Types.ObjectId, required: true, ref: "Product" },
  quantity: { type: Number, required: true, min: 1 },
  priceAtOrderTime: { type: Number, min: 1, required: true }
});

const cartSchema = new Schema<ICart>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    items: { type: [cartItemSchema], required: true },
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
