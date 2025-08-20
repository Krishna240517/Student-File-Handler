import express from "express";
import multer from "multer";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadFile, getDownloadUrl, deleteFile } from "../controllers/file.controller.js"
const fileRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

fileRoute.post("/upload",protect,upload.single('file'), uploadFile);
fileRoute.get("/downloadUrl/:fileId",protect, getDownloadUrl);
fileRoute.delete("/delete/:fileId",protect,deleteFile);

export default fileRoute;
