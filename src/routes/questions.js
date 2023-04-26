import express from "express";
import sequelize from "../models/index.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/answer", async (req, res) => {
  const { questionId, answer } = req.body;
  try {
    await sequelize.query(
      `UPDATE patient_questions SET answer = '${sequelize.escape(
        answer
      )}' WHERE id = ${sequelize.escape(questionId)}`
    );
    res.status(200).json({
      message: "Answered successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
