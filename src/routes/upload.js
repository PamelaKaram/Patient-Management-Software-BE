import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import express from "express";
const router = express.Router();

import * as dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY, // store it in .env file to keep it safe
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: process.env.S3_REGION, // this is the region that you select in AWS account
});

const BUCKET = process.env.S3_BUCKET;

const s3Storage = multerS3({
  s3: s3, // s3 instance
  bucket: BUCKET, // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName =
      Date.now() + "_" + file.fieldname + "_" + file.originalname;
    cb(null, fileName);
  },
});

// our middleware
const uploadImage = multer({
  storage: s3Storage,
  limits: {
    fileSize: 1024 * 1024 * 200, // 200mb file size
  },
});

router.post(
  "/",
  uploadImage.single("recfile"),
  async function (req, res, next) {
    res.send("Successfully uploaded " + req.file.location + " location!");
  }
);

router.get("/list", async (req, res) => {
  const command = new ListObjectsCommand({ Bucket: BUCKET });
  const response = await s3.send(command);
  let x = response.Contents.map((item) => item.Key);
  res.send(x);
});

router.get("/download/:filename", async (req, res) => {
  const filename = req.params.filename;
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: "1682169212173_file_pass.txt",
  });
  const response = await s3.send(command);
  const contentType = response.ContentType;
  res.set({
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename=${filename}`,
  });
  res.send(response.Body.toString());
});

router.delete("/delete/:filename", async (req, res) => {
  const filename = req.params.filename;
  const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: filename });
  const response = await s3.send(command);
  res.send("File Deleted Successfully");
});

export default router;
