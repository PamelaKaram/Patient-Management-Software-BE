import express from "express";
import sequelize from "../models/index.js";
import authenticated from "../middlewares/authentication.js";
import isAuthorized from "../middlewares/authorization.js";
import Roles from "../enums/roles.js";
import { v4 as uuidv4 } from "uuid";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { firstName, lastName, email, phoneNumber, message } = req.body;
  try {
    const appointment = await sequelize.query(
      `INSERT INTO appointment_requests (firstName, lastName, email, phoneNumber, message, isResponded, appointmentUUID) VALUES (${sequelize.escape(
        firstName
      )}, ${sequelize.escape(lastName)}, ${sequelize.escape(
        email
      )}, ${sequelize.escape(phoneNumber)}, ${sequelize.escape(
        message
      )}, false, ${uuidv4()});`
    );
    res.status(201).send({
      msg: "Appointment created successfully!",
      appointment,
    });
  } catch (err) {
    res.status(500).send({
      msg: "Error creating appointment!",
      err: err.message,
    });
  }
});

router.get(
  "/get",
  authenticated,
  isAuthorized([Roles.DOCTOR]),
  async (req, res) => {
    try {
      const appointments = await sequelize.query(
        `SELECT * FROM appointment_requests WHERE isResponded = false;`
      );
      res.status(200).send({
        msg: "Appointment requests fetched successfully!",
        appointments: appointments[0],
      });
    } catch (err) {
      res.status(500).send({
        msg: "Error fetching appointment requests!",
        err: err.message,
      });
    }
  }
);

router.post("/acceptOrReject", async (req, res) => {
  const { appointmentUUID, status } = req.body;
  try {
    const appointment = await sequelize.query(
      `UPDATE appointment_requests SET status = ${sequelize.escape(
        status
      )} WHERE appointmentUUID = ${sequelize.escape(appointmentUUID)};`
    );
    res.status(201).send({
      msg: "Appointment updated successfully!",
      appointment,
    });
  } catch (err) {
    res.status(500).send({
      msg: "Error updating appointment!",
      err: err.message,
    });
  }
});

export default router;