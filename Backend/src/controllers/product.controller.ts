import { Request, Response } from "express";
import { Product } from "../models/product.model";
import {
  productParams,
  productZod,
  updateProductZod,
} from "../schemas/product.zod";
import cloudinary from "../config/cloudinary.config";

// Get All Products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = "1",
      limit = "10",
      sort,
    } = req.query;

    const query: any = { isActive: true};

    if (search) {
      query.$or = [
        { name: { $regex: search, options: "i" } },
        { description: { $regex: search, options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $regex: `^${category}$`, options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    
    let sortOption: any = { createdAt: -1 };
    if (sort === "price_asc") {
      sortOption = { price: 1 };
    }
    if (sort === "price_desc") {
      sortOption = { price: -1 };
    }
    if (sort === "latest") {
      sortOption = { createdAt: -1 };
    }

    const product = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);
    const total = await Product.countDocuments(query);
    
    return res.status(200).json({
      message: "Success",
      page: pageNumber,
      total,
      pages: Math.ceil(total / limitNumber),
      data: product,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Product BY ID
export const getProductByID = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = productParams.safeParse(req.params);
    if (!success) {
      return res.status(400).json({ message: "Invalid Data", error });
    }
    const product = await Product.findById(data.id);
    if (!product?.isActive) {
      return res.status(404).json({ message: "The product was deleted" });
    }
    return res.status(200).json({ message: "Success", data: product });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

// Create Product
export const createProduct = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const file = req.file as any;
    if (!file) {
      return res.status(404).json({ message: "Image not found" });
    }
    
    const parsedData = JSON.parse(req.body.data);
    const { success, data, error } = productZod.safeParse(parsedData);
    if (!success) {
      return res
        .status(400)
        .json({ message: "Invalid Data", error: error.issues[0].message });
    }
    
    const product = await Product.create({
      ...data,
      image: file.path,
      publicID: file.filename,
    });
    
    return res.status(201).json({ message: "Success", product });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const params = productParams.safeParse(req.params);
    if (!params.success) {
      return res
        .status(400)
        .json({ message: "Invalid Product ID", error: params.error });
    }
    
    const { success, data, error } = updateProductZod.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Invalid Product Data",
        error: error.issues[0].message,
      });
    }
    
    const product = await Product.findById(params.data.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (req.file) {
      await cloudinary.uploader.destroy(product.publicID);
      const file = req.file as any;
      product.publicID = file.filename;
      product.image = file.path;
    }
    
    product.set(data);
    await product.save();
    
    return res.status(200).json({
      message: "Product Updated Successfully",
      data: product,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

//Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const params = productParams.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Enter valid data" });
    }
    
    const product = await Product.findByIdAndUpdate(params.data.id, {
      isActive: false,
    });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    return res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};
