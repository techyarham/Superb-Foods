import { Types, Document } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  priceAtOrderTime: number;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
}
