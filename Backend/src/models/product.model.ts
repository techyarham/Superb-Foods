import mongoose from "mongoose";
import { Iproduct } from "../types/products.type";

const productSchema = new mongoose.Schema<Iproduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    isActive: { type: Boolean, default: true },
    publicID: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }
  },
  { timestamps: true }
);

export const Product = mongoose.model<Iproduct>("Product", productSchema);
