import express from "express";
import sequelize from "../models/index.js";
import authenticated from "../middlewares/authentication.js";
import isAuthorized from "../middlewares/authorization.js";
import Roles from "../enums/roles.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

//adds medicine to the current prescription
router.post(
  "/addMedicine",
  authenticated,
  isAuthorized([Roles.DOCTOR]),
  async (req, res) => {
    const { patientId, medicine } = req.body;
    try {
      const medicalQueries = medicine
        .map((item) => {
          return `(${sequelize.escape(patientId)}, ${sequelize.escape(
            item.medicine
          )}, true, ${sequelize.escape(item.description)}, ${sequelize.escape(
            item.frequency
          )}, ${sequelize.escape(item.foodTiming)})`;
        })
        .join(",");
      await sequelize.query(
        `INSERT INTO medicines (prescriptionId, medicine, isCurrent, description, frequency, foodTiming) VALUES ${medicalQueries}`
      );
      const tomorrow = new Date(new Date());
      tomorrow.setDate(tomorrow.getDate() + 1);
      // send medicine reminder at 5am
      const dateTime = new Date(
        tomorrow.toISOString().split("T")[0] + "T" + "05:00:00" + "Z"
      );
      await sequelize.query(
        `INSERT INTO queues (jobType, data, time) VALUES ('medicine', '{"id": ${patientId}}', ${sequelize.escape(
          dateTime
        )});`
      );
      res.status(201).send({
        msg: "Medicines created successfully!",
        medicalQueries,
      });
    } catch (err) {
      res.status(500).send({
        msg: "Error creating medicines!",
        err: err.message,
      });
    }
  }
);

//creates new prescription and invalidates the previous one
router.post(
  "/addNewPrescription",
  authenticated,
  isAuthorized([Roles.DOCTOR]),
  async (req, res) => {
    const { patientId, medicine } = req.body;
    try {
      await sequelize.query(
        `UPDATE medicines SET isCurrent = false WHERE prescriptionId = ${sequelize.escape(
          patientId
        )} AND isCurrent = true;`
      );
      const medicalQueries = medicine
        .map((item) => {
          return `(${sequelize.escape(patientId)}, ${sequelize.escape(
            item.medicine
          )}, true, ${sequelize.escape(item.description)}, ${sequelize.escape(
            item.frequency
          )}, ${sequelize.escape(item.foodTiming)})`;
        })
        .join(",");
      await sequelize.query(
        `INSERT INTO medicines (prescriptionId, medicine, isCurrent, description, frequency, foodTiming) VALUES ${medicalQueries}`
      );
      const tomorrow = new Date(new Date());
      tomorrow.setDate(tomorrow.getDate() + 1);
      // send medicine reminder at 5am
      const dateTime = new Date(
        tomorrow.toISOString().split("T")[0] + "T" + "05:00:00" + "Z"
      );
      await sequelize.query(
        `INSERT INTO queues (jobType, data, time) VALUES ('medicine', '{"id": ${patientId}}', ${sequelize.escape(
          dateTime
        )});`
      );
      res.status(201).send({
        msg: "Medicines created successfully!",
        medicalQueries,
      });
    } catch (err) {
      res.status(500).send({
        msg: "Error creating medicines!",
        err: err.message,
      });
    }
  }
);

router.get(
  "/getMedicalPrescription",
  authenticated,
  isAuthorized([Roles.DOCTOR, Roles.PATIENT]),
  async (req, res) => {
    const { patientUUID } = req.query;
    try {
      const medicines = await sequelize.query(
        `SELECT * FROM medicines WHERE patientUUID = ${sequelize.escape(
          patientUUID
        )} AND isCurrent = true;`
      );
      res.status(200).send({
        msg: "Medicines fetched successfully!",
        medicines: medicines[0],
      });
    } catch (err) {
      res.status(500).send({
        msg: "Error fetching medicines!",
        err: err.message,
      });
    }
  }
);

router.get(
  "/previousMedicalPrescription",
  authenticated,
  isAuthorized([Roles.DOCTOR, Roles.PATIENT]),
  async (req, res) => {
    const { patientUUID } = req.query;
    try {
      const medicines = await sequelize.query(
        `SELECT * FROM medicines WHERE patientUUID = ${sequelize.escape(
          patientUUID
        )} AND isCurrent = false;`
      );
      res.status(200).send({
        msg: "Medicines fetched successfully!",
        medicines: medicines[0],
      });
    } catch (err) {
      res.status(500).send({
        msg: "Error fetching medicines!",
        err: err.message,
      });
    }
  }
);

export default router;
