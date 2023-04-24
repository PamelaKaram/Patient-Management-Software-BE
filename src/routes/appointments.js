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
      newDate.toISOString().split("T")[0] + "T" + time + "Z"
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

export default router;
