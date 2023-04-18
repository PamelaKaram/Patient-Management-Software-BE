import express from "express";
import sequelize from "./models/index.js";
import { signupValidation, loginValidation, ROLES } from "./validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticated from "./middlewares/authentication.js";
import isAuthorized from "./middlewares/authorization.js";
import client from "../config/typesense.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/registerPatient", signupValidation, async (req, res) => {
  // LOWER() for lower case
  // escape() method sanitizes the input to prevent SQL injection
  const {
    firstName,
    lastName,
    email,
    birthday,
    phoneNumber,
    createdAt,
    updatedAt,
  } = req.body;
  console.log(req.body);
  try {
    const getUser = await sequelize.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER(${sequelize.escape(
        email
      )});`
    );
    if (getUser[0].length > 0) {
      return res.status(409).send({
        msg: "Email already in use!",
      });
    }
    const password = generateRandomPassword(8);
    const hash = await bcrypt.hash(password, 10);
    await sequelize.query(
      `INSERT INTO users (email, lastName, firstName, phoneNumber, birthday, password, role, createdAt, updatedAt) VALUES (${sequelize.escape(
        email
      )}, ${sequelize.escape(lastName)}, ${sequelize.escape(
        firstName
      )}, ${sequelize.escape(phoneNumber)}, ${sequelize.escape(
        birthday
      )}, ${sequelize.escape(password)}, ${sequelize.escape(
        ROLES.PATIENT
      )}, ${sequelize.escape(createdAt)}, ${sequelize.escape(updatedAt)});`
    );
    return res.status(201).send({
      msg: "The user has been registered",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      msg: e,
    });
  }
});

const generateRandomPassword = (length) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";

  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};

router.post("/login", loginValidation, async (req, res) => {
  const { email, password } = req.body;
  try {
    const getUser = await sequelize.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER(${sequelize.escape(
        email
      )});`
    );
    if (getUser.length === 0) {
      return res.status(409).send({
        msg: "Email or password is incorrect",
      });
    }
    const match = await bcrypt.compare(password, getUser[0].password);
    if (!match) {
      return res.status(409).send({
        msg: "Email or password is incorrect",
      });
    }
    const user = {
      id: getUser[0].id,
      role: ROLES.PATIENT,
    };
    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "15min",
    });
    const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_TOKEN);
    return res.status(200).send({
      accessToken,
      refreshToken,
      user: getUser[0],
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      msg: err,
    });
  }
});

router.post("/token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);
  try {
    const decode = await jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN
    );
    const user = {
      id: decode.id,
      role: decode.role,
    };
    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "15min",
    });
    return res.status(200).send({
      accessToken,
    });
  } catch (e) {
    return res.sendStatus(403);
  }
});

router.get("/user", authenticated, async (req, res) => {
  try {
    const getUser = await sequelize.query(
      `SELECT * FROM users WHERE id = ${sequelize.escape(req.user.id)};`
    );
    return res.status(200).send({
      user: getUser[0],
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      msg: e,
    });
  }
});

router.get("/users", async (req, res) => {
  let searchParameters = {
    q: "j",
    query_by: "firstName",
  };

  client
    .collections("users")
    .documents()
    .search(searchParameters)
    .then(function (searchResults) {
      console.log(searchResults);
    });
});

router.get("/admin", authenticated, isAuthorized(ROLES.admin), (req, res) => {
  res.send("Admin page");
});

export default router;
