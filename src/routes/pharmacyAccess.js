import express from "express";
import sequelize from "../models/index.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/giveAccess", async (req, res) => {
  const { pharmacyId, patientId } = req.body;
  try {
    await sequelize.query(
      `INSERT INTO pharmacy_accesses (pharmacyId, patientId, hasAccess, createdAt, updatedAt) VALUES (${sequelize.escape(
        pharmacyId
      )}, ${sequelize.escape(patientId)}, true, '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}', '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}')`
    );
    res.status(200).json({
      message: "Access given successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

