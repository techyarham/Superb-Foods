import { Types } from "mongoose";

export interface OrderProduct {
  product: Types.ObjectId;
  priceAtOrderTime: number;
  quantity: number;
}

export type OrderStatus = "pending" | "accepted" | "rejected";

export interface OrderAddress {
  fullName: string;
  deliveryAddress: string;
  phone: string;
}

export interface Order {
  user: Types.ObjectId;
  address: OrderAddress;
  products: OrderProduct[];
  status: OrderStatus;
  total: number;
  isActive: boolean;
  estimatedTime?: string;
}
