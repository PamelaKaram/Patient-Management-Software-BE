import express from "express";
import sequelize from "../models/index.js";

import * as dotenv from "dotenv";
import getNextMedicine from "../hooks/medicines.js";
dotenv.config();

const router = express.Router();

//adds medicine to the current prescription
router.post("/addMedicine", async (req, res) => {
  const { patientId, medicine } = req.body;
  try {
    const medicalQueries = medicine
      .map((item) => {
        return `(${sequelize.escape(patientId)}, ${sequelize.escape(
          item.medicine
        )}, true, ${sequelize.escape(item.description)}, ${sequelize.escape(
          item.frequency
        )}, ${sequelize.escape(item.foodTiming)}, '${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}', '${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}')`;
      })
      .join(",");
    await sequelize.query(
      `INSERT INTO medicines (prescriptionId, medicine, isCurrent, description, frequency, foodTiming, createdAt, updatedAt) VALUES ${medicalQueries}`
    );
    const tomorrow = new Date(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);
    // send medicine reminder at 5am
    const dateTime = new Date(
      tomorrow.toISOString().split("T")[0] + "T" + "05:00:00" + "Z"
    );
    await sequelize.query(
      `INSERT INTO queues (jobType, data, time, createdAt, updatedAt) VALUES ('medicine', '{"id": ${patientId}}', ${sequelize.escape(
        dateTime
      )}, '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}', '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}');`
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
});

//creates new prescription and invalidates the previous one
router.post("/addNewPrescription", async (req, res) => {
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
        )}, ${sequelize.escape(item.foodTiming)}, '${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}', '${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}')`;
      })
      .join(",");
    await sequelize.query(
      `INSERT INTO medicines (prescriptionId, medicine, isCurrent, description, frequency, foodTiming, createdAt, updatedAt) VALUES ${medicalQueries}`
    );
    const tomorrow = new Date(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);
    // send medicine reminder at 5am
    const dateTime = new Date(
      tomorrow.toISOString().split("T")[0] + "T" + "05:00:00" + "Z"
    );
    await sequelize.query(
      `INSERT INTO queues (jobType, data, time, createdAt, updatedAt) VALUES ('medicine', '{"id": ${patientId}}', ${sequelize.escape(
        dateTime
      )}, '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}', '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}');`
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
});

router.get("/getMedicines", async (req, res) => {
  const { patientId } = req.body;
  try {
    const medicines = await sequelize.query(
      `SELECT * FROM medicines WHERE prescriptionId = ${sequelize.escape(
        patientId
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
});

export default router;
