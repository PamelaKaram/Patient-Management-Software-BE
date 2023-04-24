import express from "express";
import sequelize from "../models/index.js";

import * as dotenv from "dotenv";
import getNextMedicine from "../hooks/medicines.js";
dotenv.config();

const router = express.Router();

router.post("/addMedicine", async (req, res) => {
  const { patientId, medicine } = req.body;
  console.log(medicine);
  try {
    const medicalQueries = medicine
      .map((item) => {
        return `(${sequelize.escape(patientId)}, ${sequelize.escape(
          item.medicine
        )}, false, ${sequelize.escape(item.description)}, ${sequelize.escape(
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
    const medicalPrescription = await sequelize.query(
      `INSERT INTO medicines (prescriptionId, medicine, isCurrent, description, frequency, foodTiming, createdAt, updatedAt) VALUES ${medicalQueries}`
    );
    const tomorrow = new Date(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);
    // send medicine reminder at 6am
    const dateTime = new Date(
      tomorrow.toISOString().split("T")[0] + "T" + "06:00:00" + "Z"
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
    console.log(medicalPrescription);
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

export default router;
