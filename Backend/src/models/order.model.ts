import mongoose, { Schema, Document, Types } from "mongoose";
import {
  OrderStatus,
  OrderProduct,
  Order as OrderType,
  OrderAddress,
} from "../types/order.types";

export interface OrderDoc extends Document, OrderType {}

const orderProductSchema = new Schema<OrderProduct>({
  product: { type: Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, min: 1, required: true },
  priceAtOrderTime: { type: Number, min: 1, required: true },
});

const addressSchema = new Schema<OrderAddress>({
  fullName: { type: String, trim: true, required: true },
  deliveryAddress: { type: String, required: true },
  phone: { type: String, required: true },
});

const orderSchema = new Schema<OrderDoc>(
  {
    user: { type: Types.ObjectId, required: true, ref: "User" },
    products: { type: [orderProductSchema], required: true },
    address: { type: addressSchema, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    total: { type: Number, min: 1, required: true },
    isActive: { type: Boolean, default: true },
    estimatedTime: { type: String, default: null }
  },
  { timestamps: true }
);

export const Order = mongoose.model<OrderDoc>("Order", orderSchema);
