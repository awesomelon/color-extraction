import express, { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { ColorExtractor } from "../core.js";
import serverless from "serverless-http";

const app = express();
const router = Router();

function ensureUploadDirExists(uploadDir) {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
}

function initMulter(uploadDir) {
  return multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // 파일 확장자를 유지
      },
    }),
  });
}

async function handleFileUpload(req, res) {
  try {
    const colorExtractor = ColorExtractor.getInstance();
    const { colors, dominantColor } = await colorExtractor.extractColors(
      req.file.path,
    );
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Failed to delete file:", err);
      }
    });
    res.json({ colors, dominantColor });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error processing image");
  }
}

const uploadDir = "uploads";
ensureUploadDirExists(uploadDir);
const upload = initMulter(uploadDir);

router().post("/upload", upload.single("image"), handleFileUpload);

app.use("/.netlify/functions/app", router);

export const handler = serverless(app);
