import express from "express";
import sequelize from "../models/index.js";
import authenticated from "../middlewares/authentication.js";
import isAuthorized from "../middlewares/authorization.js";
import Roles from "../enums/roles.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/addCondition", async (req, res) => {
  const { patientUUID, condition } = req.body;
  try {
    await sequelize.query(
      `INSERT INTO medical_conditions (patientUUID, description, isCurrent) VALUES (${sequelize.escape(
        patientUUID
      )}, ${sequelize.escape(condition)}, true);`
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

router.post("/removeCondition", async (req, res) => {
  const { patientId, conditionId } = req.body;
  try {
    await sequelize.query(
      `UPDATE medical_conditions SET isCurrent = false WHERE id = ${sequelize.escape(
        conditionId
      )} AND patientId = ${sequelize.escape(patientId)};`
    );
    res.status(201).send({
      msg: "Condition removed successfully!",
    });
  } catch (err) {
    res.status(500).send({
      msg: "Error removing condition!",
      err: err.message,
    });
  }
});

router.get(
  "/pharmacyGetCondition/",
  authenticated,
  isAuthorized(Roles.PHARMACY),
  async (req, res) => {
    const { patientId } = req.query;
    try {
      const [conditions] = await sequelize.query(
        `SELECT * 
         FROM medical_conditions
         WHERE patientId = ${sequelize.escape(
          patientId
        )} AND isCurrent = true;`
      );
      res.status(201).send({
        msg: "Conditions fetched successfully!",
        conditions,
      });
    } catch (err) {
      res.status(500).send({
        msg: "Error fetching conditions!",
        err: err.message,
      });
    }
  }
);

export default router;
