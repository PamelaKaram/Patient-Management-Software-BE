import express from "express";
import sequelize from "../models/index.js";

import * as dotenv from "dotenv";
import authenticated from "../middlewares/authentication.js";
import isAuthorized from "../middlewares/authorization.js";
import Roles from "../enums/roles.js";
dotenv.config();

const router = express.Router();

router.post("/answer", async (req, res) => {
  const { questionId, answer } = req.body;
  try {
    await sequelize.query(
      `UPDATE patient_questions SET answer = '${sequelize.escape(
        answer
      )}' WHERE id = ${sequelize.escape(questionId)}`
    );
    res.status(200).json({
      message: "Answered successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post(
  "/patientQuestion",
  authenticated,
  isAuthorized(Roles.PATIENT),
  async (req, res) => {
    const { patientUUID, question } = req.body;
    if (!question) {
      return res
        .status(400)
        .json({ msg: "Question is empty, please enter it" });
    }
    try {

      const [id] = await sequelize.query(
        `SELECT id 
        FROM users 
        WHERE uuid = ${sequelize.escape(patientUUID)}`
      );
      console.log(id[0].id)
      if (id[0].length === 0) {
        return res.status(400).json({ msg: "Patient does not exist" });
      }

      await sequelize.query(
        `INSERT INTO patient_questions (isAnswered, patientId, patientUUId, question) VALUES (0 ,${sequelize.escape(id[0].id)}, ${sequelize.escape(patientUUID)}, ${sequelize.escape(question)});`
      );
      res.status(200).json({
        message: "Question added successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

export default router;
