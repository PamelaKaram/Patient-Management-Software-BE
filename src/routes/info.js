import express from "express";
import sequelize from "../models/index.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/patient", async (req, res) => {
  const { patientUUID } = req.query;
  console.log(req.query);
  try {
    const data = await sequelize.query(
      `SELECT * FROM users WHERE uuid = ${sequelize.escape(patientUUID)};`
    );
    console.log(data[0][0]);
    res.status(201).json({
      data: data[0][0],
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error creating condition!",
      err: err.message,
    });
  }
});

router.get("/doctor", async (req, res) => {
  const { doctorUUID } = req.query;
  try {
    const data = await sequelize.query(
      `SELECT * FROM users WHERE uuid = ${sequelize.escape(doctorUUID)};`
    );
    res.status(201).json({
      data: data[0][0],
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error creating condition!",
      err: err.message,
    });
  }
});

router.get("/pharmacy", async (req, res) => {
  const { pharmacyUUID } = req.query;
  try {
    const data = await sequelize.query(
      `SELECT * FROM users WHERE uuid = ${sequelize.escape(pharmacyUUID)};`
    );
    res.status(201).json({
      data: data[0][0],
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error creating condition!",
      err: err.message,
    });
  }
});

export default router;
