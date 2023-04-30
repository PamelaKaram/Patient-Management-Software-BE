import express from "express";
import sequelize from "../models/index.js";
import authenticated from "../middlewares/authentication.js";
import isAuthorized from "../middlewares/authorization.js";
import Roles from "../enums/roles.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post(
  "/giveAccess",
  authenticated,
  isAuthorized([Roles.DOCTOR]),
  async (req, res) => {
    const { pharmacyId, patientId } = req.body;
    try {
      await sequelize.query(
        `INSERT INTO pharmacy_accesses (pharmacyId, patientId, hasAccess) VALUES (${sequelize.escape(
          pharmacyId
        )}, ${sequelize.escape(patientId)}, true)`
      );
      res.status(200).json({
        message: "Access given successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

router.get("/hasAccess", async (req, res) => {
  const { pharmacyId, patientId } = req.body;
  try {
    const result = await sequelize.query(
      `SELECT * FROM pharmacy_accesses WHERE pharmacyId = ${sequelize.escape(
        pharmacyId
      )} AND patientId = ${sequelize.escape(patientId)} AND hasAccess = true;`
    );
    if (result[0][0].hasAccess) {
      res.status(200).json({
        message: "Access granted",
      });
    } else {
      res.status(200).json({
        message: "Access denied",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post(
  "/removeAccess",
  authenticated,
  isAuthorized([Roles.DOCTOR]),
  async (req, res) => {
    const { pharmacyId, patientId } = req.body;
    try {
      await sequelize.query(
        `UPDATE pharmacy_accesses SET hasAccess = false WHERE pharmacyId = ${sequelize.escape(
          pharmacyId
        )} AND patientId = ${sequelize.escape(patientId)};`
      );
      res.status(200).json({
        message: "Access removed successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

export default router;
