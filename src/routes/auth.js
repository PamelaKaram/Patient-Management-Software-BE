import express from "express";
import sequelize from "../models/index.js";
import nodeMailer from "nodemailer";
import {
  addPatientValidation,
  loginValidation,
  addPharmacyValidation,
  forgetPassValidation,
} from "../validation.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticated from "../middlewares/authentication.js";
import isAuthorized from "../middlewares/authorization.js";
import Roles from "../enums/roles.js";
import {
  updatePatientSchema,
  updatePharmacySchema,
} from "../../config/typesense.js";
import rateLimit from "express-rate-limit";

import { v4 as uuidv4 } from "uuid";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // max 5 requests per window
  message: "Too many login attempts. Please try again in 10 minutes.",
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

router.post(
  "/registerPatient",
  addPatientValidation,
  authenticated,
  isAuthorized([Roles.DOCTOR]),
  async (req, res) => {
    // LOWER() for lower case
    // escape() method sanitizes the input to prevent SQL injection
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
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
      console.log("PASSWORD", password);
      const hash = await bcrypt.hash(password, 10);
      await sequelize.query(
        `INSERT INTO users (email, lastName, firstName, phoneNumber, birthday, password, role, uuid) VALUES (${sequelize.escape(
          email
        )}, ${sequelize.escape(lastName)}, ${sequelize.escape(
          firstName
        )}, ${sequelize.escape(phoneNumber)}, ${sequelize.escape(
          birthday
        )}, ${sequelize.escape(hash)}, ${sequelize.escape(
          Roles.PATIENT
        )}, '${uuidv4()}');`
      );

      const transporter = nodeMailer.createTransport({
        service: "outlook",
        auth: {
          user: "drwalidpatientsoftware@outlook.com",
          pass: "PatientSoftware",
        },
      });

      const mailOptions = {
        from: "drwalidpatientsoftware@outlook.com",
        to: email,
        subject: "Welcome to the Health Care System",
        text: `Hello ${firstName} ${lastName},\n\nYou have been registered to the Health Care System.\n\n
         Your email is: ${email}\n\n
         Your password is: ${password}\n\nPlease change your password after logging in.\n\nBest regards,\nHealth Care System`,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.log(err);
      }
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
  addPharmacyValidation,
  authenticated,
  isAuthorized([Roles.DOCTOR]),
  async (req, res) => {
    // LOWER() for lower case
    // escape() method sanitizes the input to prevent SQL injection
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, phoneNumber, name } = req.body;
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
        `INSERT INTO users (email, firstName, lastName, phoneNumber, birthday, password, role, uuid) VALUES (${sequelize.escape(
          email
        )}, "Pharmacy", ${sequelize.escape(name)}, ${sequelize.escape(
          phoneNumber
        )}, '${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}', ${sequelize.escape(hash)}, ${sequelize.escape(
          Roles.PHARMACY
        )}, '${uuidv4()}');`
      );
      const transporter = nodeMailer.createTransport({
        service: "outlook",
        auth: {
          user: "drwalidpatientsoftware@outlook.com",
          pass: "PatientSoftware",
        },
      });

      const mailOptions = {
        from: "drwalidpatientsoftware@outlook.com",
        to: email,
        subject: "Welcome to the Health Care System",
        text: `Hello ${firstName} ${lastName},\n\nYou have been registered to the Health Care System.\n\n
         Your email is: ${email}\n\n
         Your password is: ${password}\n\nPlease change your password after logging in.\n\nBest regards,\nHealth Care System`,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.log(err);
      }
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

// router.post("/addDoctor", async (req, res) => {
//   // LOWER() for lower case
//   // escape() method sanitizes the input to prevent SQL injection
//   const { email, birthday, phoneNumber, password, firstName, lastName } =
//     req.body;
//   try {
//     const getUser = await sequelize.query(
//       `SELECT * FROM users WHERE LOWER(email) = LOWER(${sequelize.escape(
//         email
//       )});`
//     );
//     if (getUser[0].length > 0) {
//       return res.status(409).send({
//         msg: "Email already in use!",
//       });
//     }
//     const hash = await bcrypt.hash(password, 10);
//     await sequelize.query(
//       `INSERT INTO users (email, firstName, lastName, phoneNumber, birthday, password, role, uuid) VALUES (${sequelize.escape(
//         email
//       )}, ${sequelize.escape(firstName)}, ${sequelize.escape(
//         lastName
//       )}, ${sequelize.escape(phoneNumber)}, ${sequelize.escape(
//         birthday
//       )}, ${sequelize.escape(hash)}, ${sequelize.escape(
//         Roles.DOCTOR
//       )}, '${uuidv4()}');`
//     );
//     return res.status(201).send({
//       msg: "The Doctor has been registered",
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).send({
//       msg: e,
//     });
//   }
// });

router.post("/login", loginLimiter, loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const getUser = await sequelize.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER(${sequelize.escape(
        email
      )});`
    );
    const user = getUser[0][0];
    if (user.length === 0) {
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
    console.log(user);
    const userToken = {
      id: user.id,
      role: user.role,
      uuid: user.uuid,
    };
    const accessToken = jwt.sign(userToken, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "15min",
    });
    const refreshToken = jwt.sign(userToken, process.env.JWT_REFRESH_TOKEN);
    await sequelize.query(
      `INSERT into refreshTokens (userId, refreshToken) VALUES (${sequelize.escape(
        user.id
      )}, ${sequelize.escape(refreshToken)})`
    );
    return res.status(200).send({
      accessToken,
      refreshToken,
      user: userToken,
    });
  } catch (e) {
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
}); //get refresh token from header jwt, check if refreshtoken in db in /token

router.post("/token", authenticated, async (req, res) => {
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

router.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  try {
    const getUser = await sequelize.query(
      `SELECT *
      FROM users 
      WHERE LOWER(email) = LOWER(${sequelize.escape(email)});`
    );
    const user = getUser[0][0];
    if (user.length === 0) {
      return res.status(404).send({
        msg: "Email not found",
      });
    }
    const code = Math.floor(100000 + Math.random() * 900000);

    await sequelize.query(
      `INSERT INTO user_verifications (userUUId, code) 
      VALUES (${sequelize.escape(user.uuid)},${sequelize.escape(code)});`
    );
    const transporter = nodeMailer.createTransport({
      service: "outlook",
      auth: {
        user: "drwalidpatientsoftware@outlook.com",
        pass: "PatientSoftware",
      },
    });
    const mailOptions = {
      from: "drwalidpatientsoftware@outlook.com",
      to: email,
      subject: "Reset Password",
      text: `Your reset code is ${code}`,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (e) {
      console.log(e);
    }
    return res.status(200).send({
      msg: "Email sent",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      msg: e,
    });
  }
});

router.post("/resetPassword", forgetPassValidation, async (req, res) => {
  const { email, code, password, confirmPassword } = req.body;
  try {
    const getUser = await sequelize.query(
      `SELECT uuid FROM users WHERE LOWER(email) = LOWER(${sequelize.escape(
        email
      )});`
    );
    const user = getUser[0][0];
    if (user.length === 0) {
      return res.status(404).send({
        msg: "Email not found",
      });
    }
    const getVerification = await sequelize.query(
      `SELECT * 
      FROM user_verifications 
      WHERE userUUId = ${sequelize.escape(
        user.uuid
      )} AND code = ${sequelize.escape(code)};`
    );
    if (getVerification[0].length === 0) {
      return res.status(404).send({
        msg: "Code not found",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).send({
        msg: "Passwords do not match",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await sequelize.query(
      `UPDATE users SET password = ${sequelize.escape(
        hashedPassword
      )} WHERE uuid = ${sequelize.escape(user.uuid)};`
    );
    await sequelize.query(
      `DELETE FROM user_verifications WHERE userUUId = ${sequelize.escape(
        user.uuid
      )}`
    );
    return res.status(200).send({
      msg: "Password reset successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      msg: e,
    });
  }
});

export default router;
