import express from "express";
import sequelize from "../models/index.js";
import authenticated from "../middlewares/authentication.js";
import isAuthorized from "../middlewares/authorization.js";
import Roles from "../enums/roles.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post(
  "/create",
  authenticated,
  isAuthorized(Roles.DOCTOR),
  async (req, res) => {
    const { patientId, date, time, description } = req.body;
    try {
      const appointment = await sequelize.query(
        `INSERT INTO appointments (patientId, date, time, description, createdAt, updatedAt) VALUES (${sequelize.escape(
          patientId
        )}, ${sequelize.escape(date)}, ${sequelize.escape(
          time
        )}, ${sequelize.escape(description)}, '${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}', '${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}');`
      );
      res.status(201).send({
        msg: "Appointment created successfully!",
        appointment,
      });
    } catch (err) {
      res.status(500).send({
        msg: "Error creating appointment!",
        err,
      });
    }
  }
);

router.get(
  "/patientGetPast",
  authenticated,
  isAuthorized(Roles.PATIENT),
  async (req, res) => {
    const { email, fromDate, tillDate} = req.body;
    const fromDateString = fromDate.toISOString().slice(0,19);
    const tillDateString = tillDate.toISOString().slice(0,19);
    try {
      const past_appointments = await sequelize.query(
        `SELECT appointments.*, users.email FROM appointments, users WHERE appointments.patientId = users.id AND users.email = ${sequelize.escape(email)} AND appointments.date <= ${sequelize.escape(tillDateString)} AND appointments.date >= ${sequelize.escape(fromDateString)}`);
      res.status(200).send({
        msg: "Appointments retrieved successfully!",
        past_appointments,
      });
    } catch (err) {
      res.status(500).send({
        msg: "Error retrieving Appointments!",
        err,
      });
    }
  }
);

export default router;
