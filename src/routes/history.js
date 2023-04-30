import express from "express";
import sequelize from "../models/index.js";
import authenticated from "../middlewares/authentication.js";
import isAuthorized from "../middlewares/authorization.js";
import Roles from "../enums/roles.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get(
  "/getHistory",
  authenticated,
  isAuthorized([Roles.PATIENT, Roles.DOCTOR]),
  async (req, res) => {
    const { patientId } = req.query;
    try {
      const history = await sequelize.query(
        `SELECT medical_histories.* 
                FROM medical_histories, users 
                WHERE medical_histories.patientId = users.uuid AND medical_histories.patientId = ${sequelize.escape(
                  patientId
                )};`
      );
      res.status(200).send({
        msg: "History retrieved successfully!",
        history,
      });
    } catch (err) {
      res.status(500).send({
        msg: "Error retrieving history!",
        err: err.message,
      });
    }
  }
);

export default router;
