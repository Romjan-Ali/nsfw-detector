import { Router } from "express";
import multer from "multer";
import { nsfwCheck } from "../middleware/nsfwCheck.js";

const router = Router();
const upload = multer(); // memory storage

// Upload local file
router.post("/upload", upload.single("image"), nsfwCheck);

// Submit image URL
router.post("/check-url", nsfwCheck);

export default router;
