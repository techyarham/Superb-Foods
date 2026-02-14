import { Request, Response } from "express";
import mongoose from "mongoose";
import { Cart } from "../models/cart.model";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { addressZod, updateStatusZod } from "../schemas/order.zod";
import {
  orderPlacedEmail,
  orderRecievedEmail,
  orderConfirmedEmail,
  orderRejectedEmail,
} from "../templates/email.template";
import { User } from "../models/user.model";
import { sendEmail } from "../utils/email";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = addressZod.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Invalid data",
        error: error.issues[0].message,
      });
    }

    const userID = req.user!.id;
    const cart = await Cart.findOne({ user: userID });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const productIDs = cart.items.map((item) => item.product);

    const products = await Product.find({
      _id: { $in: productIDs },
      isActive: true,
    });

    if (products.length !== cart.items.length) {
      return res.status(400).json({
        message: "Some products are unavailable or deleted",
      });
    }

    const productMap = new Map(
      products.map((product) => [product._id.toString(), product])
    );

    let total = 0;
    const orderProducts: {
      product: any;
      quantity: number;
      priceAtOrderTime: number;
    }[] = [];

    for (const item of cart.items) {
      const product = productMap.get(item.product.toString());
      if (!product) {
        return res.status(404).json({
          message: `Product ${item.product} not found`,
        });
      }

      total += product.price * item.quantity;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        priceAtOrderTime: product.price,
      });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = await Order.create({
      user: userID,
      products: orderProducts,
      total,
      address: data,
      status: "pending",
    });

    await Cart.deleteOne({ user: userID });

    sendEmail({
      to: user.email,
      html: orderPlacedEmail({
        name: data.fullName,
        orderId: order.id,
        total,
      }),
      subject: "Order Placed Successfully!",
      text: "We have received your order & we are processing it!",
    }).catch(() => {});

    const admins = await User.find({ role: "admin", isActive: true });

    if (admins.length > 0) {
      Promise.all(
        admins.map((admin) =>
          sendEmail({
            to: admin.email,
            html: orderRecievedEmail({
              name: data.fullName,
              orderId: order.id,
              total,
              time: new Date().toLocaleString(),
            }),
            subject: "New Order Arrived!",
            text: "New order arrived, please review it!",
          })
        )
      ).catch(() => {});
    }

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userID = req.user!.id;

    const orders = await Order.find({ user: userID })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Success",
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { status } = req.query;
    const filter: Record<string, any> = {};

    if (
      status &&
      ["pending", "accepted", "rejected"].includes(status as string)
    ) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Success",
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const { success, data, error } = updateStatusZod.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Invalid data",
        error: error.issues[0].message,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Order already finalized",
      });
    }

    if (data.status === "accepted") {
      if (!data.estimatedTime) {
        return res.status(400).json({
          message: "Estimated time is required when accepting order",
        });
      }
      order.status = "accepted";
      order.estimatedTime = data.estimatedTime;
    }

    if (data.status === "rejected") {
      order.status = "rejected";
      order.estimatedTime = undefined;
    }

    await order.save();

    const user = await User.findById(order.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (data.status === "rejected") {
      sendEmail({
        to: user.email,
        html: orderRejectedEmail({
          name: order.address.fullName,
          orderId: order.id,
        }),
        subject: "Order Not Accepted!",
        text: "Sorry your order wasn't accepted",
      }).catch(() => {});

      return res.status(200).json({
        message: "Order rejected",
      });
    }

    sendEmail({
      to: user.email,
      html: orderConfirmedEmail({
        name: order.address.fullName,
        orderId: order.id,
        time: data.estimatedTime!,
      }),
      subject: "Order Confirmed!",
      text: "We are preparing your order",
    }).catch(() => {});

    return res.status(200).json({
      message: "Order accepted",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
