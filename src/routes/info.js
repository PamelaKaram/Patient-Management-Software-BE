import express from "express";
import sequelize from "../models/index.js";
import authenticated from "../middlewares/authentication.js";
import isAuthorized from "../middlewares/authorization.js";
import Roles from "../enums/roles.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get(
  "/patient",
  authenticated,
  isAuthorized([Roles.DOCTOR, Roles.PATIENT]),
  async (req, res) => {
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
  }
);

router.get(
  "/doctor",
  authenticated,
  isAuthorized([Roles.DOCTOR]),
  async (req, res) => {
    try {
      const data = await sequelize.query(
        `SELECT * FROM users WHERE role="doctor";`
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
  }
);

router.get("/pharmacy", authenticated, async (req, res) => {
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
