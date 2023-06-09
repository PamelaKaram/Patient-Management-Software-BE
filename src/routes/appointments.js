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
  isAuthorized([Roles.DOCTOR, Roles.DOCTOR]),
  async (req, res) => {
    const { patientUUID, date, time, description } = req.body;
    try {
      const appointment = await sequelize.query(
        `INSERT INTO appointments (patientUUID, date, time, description) VALUES (${sequelize.escape(
          patientUUID
        )}, ${sequelize.escape(date)}, ${sequelize.escape(
          time
        )}, ${sequelize.escape(description)});`
      );
      const newDate = new Date(date); // change date to before one day, continue testing
      newDate.setDate(newDate.getDate() - 1);
      const dateTime = new Date(
        newDate.toISOString().split("T")[0] + "T" + "05:00:00" + "Z"
      );
      await sequelize.query(
        `INSERT INTO queues (jobType, data, time) VALUES ('appointment', '{"id": ${
          appointment[0]
        }}', ${sequelize.escape(dateTime)});`
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
  }
);

router.get(
  "/getPastFuture",
  authenticated,
  isAuthorized([Roles.DOCTOR, Roles.DOCTOR]),
  async (req, res) => {
    const { fromDate, tillDate } = req.query;
    const fromDateString = new Date(fromDate);
    const tillDateString = new Date(tillDate);

    try {
      const [appointments] = await sequelize.query(
        `SELECT appointments.*, users.firstName, users.lastName 
        FROM appointments, users 
        WHERE appointments.patientId = users.id AND appointments.date BETWEEN ${sequelize.escape(
          fromDateString
        )} AND ${sequelize.escape(tillDateString)} `
      );
      res.status(200).send({
        msg: "Past appointments retrieved successfully!",
        appointments,
      });
    } catch (err) {
      res.status(500).send({
        msg: "Error retrieving past appointments!",
        err,
      });
    }
  }
);

router.get(
  "/patientGetPastFuture",
  authenticated,
  isAuthorized([Roles.PATIENT, Roles.DOCTOR]),
  async (req, res) => {
    const { uuid, fromDate, tillDate } = req.query;
    const fromDateString = new Date(fromDate);
    const tillDateString = new Date(tillDate);

    try {
      const [past_appointments] = await sequelize.query(
        `SELECT DISTINCT appointments.*  
        FROM appointments, users 
        WHERE appointments.patientUUId = users.uuid AND users.uuid= ${sequelize.escape(
          uuid
        )} AND appointments.date BETWEEN ${sequelize.escape(
          fromDateString
        )} AND ${sequelize.escape(tillDateString)}`
      );
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

router.get(
  "/getAvailability",
  authenticated,
  isAuthorized([Roles.DOCTOR, Roles.DOCTOR]),
  async (req, res) => {
    try {
      const today = new Date();
      const [all_appointments] = await sequelize.query(
        `SELECT appointments.*, users.firstName, users.lastName 
        FROM appointments, users 
        WHERE appointments.patientId = users.id AND users.role = "patient" AND appointments.date >= ${sequelize.escape(
          today
        )}`
      );
      res.status(200).send({
        msg: "All appointments retrieved successfully!",
        all_appointments,
      });
    } catch (err) {
      res.status(500).send({
        msg: "Error retrieving all appointments!",
        err,
      });
    }
  }
);

router.post(
  "/remindToBookAppointment",
  authenticated,
  isAuthorized([Roles.PATIENT]),
  async (req, res) => {
    const { patientUUID, date } = req.body;
    try {
      //create job in queue to remind 1 week before date
      const dateToRemind = new Date(new Date());
      dateToRemind.setDate(dateToRemind.getDate() - 7);
      // send medicine reminder at 5am
      const dateTime = new Date(
        dateToRemind.toISOString().split("T")[0] + "T" + "05:00:00" + "Z"
      );
      const job = await sequelize.query(
        `INSERT INTO queues (jobType, data, time) VALUES ('appointmentReminder', '{"patientUUID": ${sequelize.escape(
          patientUUID
        )}}', ${sequelize.escape(dateTime)});`
      );
      res.status(201).send({
        msg: "Appointment reminder created successfully!",
        job,
      });
    } catch (err) {
      res.status(500).send({
        msg: "Error creating appointment reminder!",
        err: err.message,
      });
    }
  }
);

export default router;
