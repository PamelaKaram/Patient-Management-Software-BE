import express from "express";
import sequelize from "../models/index.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/addCondition", async (req, res) => {
  const { patientId, condition } = req.body;
  try {
    await sequelize.query(
      `INSERT INTO conditions (patientId, description, isCurrent, createdAt, updatedAt) VALUES (${sequelize.escape(
        patientId
      )}, ${sequelize.escape(condition)}, true, '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}', '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}');`
    );
    res.status(201).send({
      msg: "Condition created successfully!",
    });
  } catch (err) {
    res.status(500).send({
      msg: "Error creating condition!",
      err: err.message,
    });
  }
});
export default router;