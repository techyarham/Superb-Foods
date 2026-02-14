import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "products",
    format: file.mimetype.split('/')[1],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
