import { Cart } from "../models/cart.model";
import { Product } from "../models/product.model";
import {
  addToCartZod,
  updateQuantityZod,
  cartParams,
} from "../schemas/cart.zod";
import { Request, Response } from "express";
import { Types } from "mongoose";

// ADD TO CART
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = addToCartZod.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        message: "Invalid Data",
        error: error.issues[0].message,
      });
    }

    const userID = req.user?.id;

    const product = await Product.findById(data.productID);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userID });

    if (!cart) {
      cart = await Cart.create({
        user: userID,
        items: [
          {
            product: new Types.ObjectId(data.productID),
            quantity: data.quantity,
            priceAtOrderTime: product.price,
          },
        ],
      });

      return res.status(201).json({
        message: "Added to cart",
        cart,
      });
    }

    const index = cart.items.findIndex(
      (item) => item.product.toString() === data.productID
    );

    if (index > -1) {
      cart.items[index].quantity += data.quantity;
    } else {
      cart.items.push({
        product: new Types.ObjectId(data.productID),
        quantity: data.quantity,
        priceAtOrderTime: product.price,
      });
    }

    await cart.save();

    return res.status(200).json({
      message: "Cart Updated",
      cart,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// GET CART
export const getCart = async (req: Request, res: Response) => {
  try {
    const userID = req.user?.id;

    const cart = await Cart.findOne({ user: userID }).populate(
      "items.product"
    );

    return res.status(200).json({
      message: "Success",
      cart: cart || { items: [] },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

//update quantity
export const updateQuantity = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = updateQuantityZod.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        message: "Invalid Data",
        error: error.issues[0].message,
      });
    }

    const userID = req.user?.id;

    const cart = await Cart.findOne({ user: userID });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === data.id
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    if (data.quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.product.toString() !== data.id
      );
    } else {
      item.quantity = data.quantity;
    }

    await cart.save();

    return res.status(200).json({
      message: "Cart Updated",
      cart,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// REMOVE ITEM 
export const removeItem = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = cartParams.safeParse(req.params);

    if (!success) {
      return res.status(400).json({
        message: "Invalid Product ID",
        error: error.issues[0].message,
      });
    }

    const userID = req.user?.id;

    const cart = await Cart.findOne({ user: userID });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialLength = cart.items.length;

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== data.productID
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();

    return res.status(200).json({
      message: "Item removed successfully",
      cart,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// CLEAR CART
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userID = req.user?.id;

    const cart = await Cart.findOne({ user: userID });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
