import express from "express";
import sequelize from "../models/index.js";
import authenticated from "../middlewares/authentication.js";
import isAuthorized from "../middlewares/authorization.js";
import Roles from "../enums/roles.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/create", async (req, res) => {
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
    const newDate = new Date(date); // change date to before one day, continue testing
    newDate.setDate(newDate.getDate() - 1);
    const dateTime = new Date(
      newDate.toISOString().split("T")[0] + "T" + "05:00:00" + "Z"
    );
    const job = await sequelize.query(
      `INSERT INTO queues (jobType, data, time, createdAt, updatedAt) VALUES ('appointment', '{"id": ${
        appointment[0]
      }}', ${sequelize.escape(dateTime)}, '${new Date()
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
      err: err.message,
    });
  }
});

router.get(
  "/getPastFuture",
  authenticated,
  isAuthorized(Roles.DOCTOR),
  async (req, res) => {
    const { fromDate, tillDate } = req.body;
    const fromDateString = fromDate.toISOString().slice(0,19);
    const tillDateString= tillDate.toISOString().slice(0,19);

    try {
      console.log(today);
      const past_appointments = await sequelize.query(
        `SELECT appointments.*, users.firstName, users.lastName FROM appointments, users WHERE appointments.patientId = users.id AND appointments.date >= ${sequelize.escape(fromDateString)} AND appointments.date >= ${sequelize.escape(tillDateString)} `);
      res.status(200).send({
        msg: "Past appointments retrieved successfully!",
        past_appointments,
      });
    } catch (err) {
      res.status(500).send({
        msg: "Error retrieving past appointments!",
        err,
      });
    }
  }
);

export default router;
