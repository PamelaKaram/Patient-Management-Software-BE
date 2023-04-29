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

router.post("/patientQuestion",
  authenticated,
  isAuthorized(Roles.PATIENT),
  async (req, res)=>{
  const { id, question} = req.body;
  if(!question)
  {
    return res.status(400).json({msg: "Question is empty, please enter it"});
  }
  try {
    await sequelize.query(
      `INSERT INTO patient_questions (patientId, question, createdAt, updatedAt) VALUES (${sequelize.escape(
        id
      )}, ${sequelize.escape(question)},'${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}', '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}')`
    );
    res.status(200).json({
      message: "Question added successfully",
    });
  }catch(err){
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
