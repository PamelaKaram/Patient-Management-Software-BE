import express from "express";
import sequelize from "./models/index.js";
import { signupValidation, loginValidation, ROLES } from "./validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticated from "./middlewares/authentication.js";
import isAuthorized from "./middlewares/authorization.js";
import {
  updatePatientSchema,
  updatePharmacySchema,
} from "../config/typesense.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const generateRandomPassword = (length) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";

  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};

router.post(
  "/registerPatient",
  authenticated,
  isAuthorized(ROLES.DOCTOR),
  async (req, res) => {
    // LOWER() for lower case
    // escape() method sanitizes the input to prevent SQL injection
    const { firstName, lastName, email, birthday, phoneNumber } = req.body;
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
        )}, ${sequelize.escape(hash)}, ${sequelize.escape(
          ROLES.PATIENT
        )}, '${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}', '${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}');`
      );
      await updatePatientSchema();
      return res.status(201).send({
        msg: "The user has been registered",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        msg: e,
      });
    }
  }
);

router.post(
  "/addPharmacy",
  authenticated,
  isAuthorized(ROLES.DOCTOR),
  async (req, res) => {
    // LOWER() for lower case
    // escape() method sanitizes the input to prevent SQL injection
    const { email, birthday, phoneNumber, name } = req.body;
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
        `INSERT INTO users (email, firstName, lastName, phoneNumber, birthday, password, role, createdAt, updatedAt) VALUES (${sequelize.escape(
          email
        )}, "Pharmacy", ${sequelize.escape(name)}, ${sequelize.escape(
          phoneNumber
        )}, ${sequelize.escape(birthday)}, ${sequelize.escape(
          hash
        )}, ${sequelize.escape(ROLES.PHARMACY)}, '${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}', '${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}');`
      );
      await updatePharmacySchema();
      return res.status(201).send({
        msg: "The pharmacy has been registered",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        msg: e,
      });
    }
  }
);

router.post("/addDoctor", async (req, res) => {
  // LOWER() for lower case
  // escape() method sanitizes the input to prevent SQL injection
  const { email, birthday, phoneNumber, password, firstName, lastName } =
    req.body;
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
    const hash = await bcrypt.hash(password, 10);
    await sequelize.query(
      `INSERT INTO users (email, firstName, lastName, phoneNumber, birthday, password, role, createdAt, updatedAt) VALUES (${sequelize.escape(
        email
      )}, ${sequelize.escape(firstName)}, ${sequelize.escape(
        lastName
      )}, ${sequelize.escape(phoneNumber)}, ${sequelize.escape(
        birthday
      )}, ${sequelize.escape(hash)}, ${sequelize.escape(
        ROLES.DOCTOR
      )}, '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}', '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}');`
    );
    return res.status(201).send({
      msg: "The Doctor has been registered",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      msg: e,
    });
  }
});

router.post("/login", loginValidation, async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const getUser = await sequelize.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER(${sequelize.escape(
        email
      )});`
    );
    const user = getUser[0][0];
    if (user.length === 0) {
      console.log("here");
      return res.status(409).send({
        msg: "Email or password is incorrect",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    console.log(match, password, user.password);
    if (!match) {
      return res.status(409).send({
        msg: "Email or password is incorrect",
      });
    }
    const userToken = {
      id: user.id,
      role: user.role,
    };
    console.log(userToken);
    const accessToken = jwt.sign(userToken, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "15min",
    });
    const refreshToken = jwt.sign(userToken, process.env.JWT_REFRESH_TOKEN);
    await sequelize.query(
      `INSERT into refreshTokens (userId, refreshToken, createdAt, updatedAt) VALUES (${sequelize.escape(
        user.id
      )}, ${sequelize.escape(refreshToken)}, '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}', '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}')`
    );
    return res.status(200).send({
      accessToken,
      refreshToken,
      user: userToken,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      msg: e,
    });
  }
});

router.post("/logout", authenticated, async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);
  try {
    const decode = await jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN
    );
    await sequelize.query(
      `DELETE FROM refreshTokens WHERE userId = ${sequelize.escape(
        decode.id
      )} AND refreshToken = ${sequelize.escape(refreshToken)};`
    );
    return res.sendStatus(204).send("Logged out successfully");
  } catch (e) {
    return res.sendStatus(403);
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

router.get("/admin", authenticated, isAuthorized(ROLES.admin), (req, res) => {
  res.send("Admin page");
});

export default router;
