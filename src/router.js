import express from "express";
import db from "./database.js";
import { signupValidation, loginValidation, ROLES } from "./validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticated from "./middlewares/authentication.js";
import * as dotenv from "dotenv";
import isAuthorized from "./middlewares/authorization.js";
dotenv.config();

const router = express.Router();

router.post("/register", signupValidation, async (req, res) => {
  // LOWER() for lower case
  // escape() method sanitizes the input to prevent SQL injection
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);
  try {
    const getUser = await db.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(email)});`
    );
    if (getUser.length > 0) {
      return res.status(409).send({
        msg: "Email already in use!",
      });
    }
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      `INSERT INTO users (email, password, firstName, lastName) VALUES (${db.escape(
        email
      )}, ${db.escape(hash)}, ${db.escape(firstName)}, ${db.escape(lastName)})`
    );
    return res.status(201).send({
      msg: "The user has been registerd",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      msg: e,
    });
  }
});

