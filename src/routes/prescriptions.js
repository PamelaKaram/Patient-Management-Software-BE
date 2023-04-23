import express from "express";
import sequelize from "../models/index.js";
import authenticated from "../middlewares/authentication.js";
import isAuthorized from "../middlewares/authorization.js";
import Roles from "../enums/roles.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get(
    "/getPrescription",
    authenticated,
    isAuthorized(Roles.PHARMACY),
    async (req, res) => { 
        const { email } = req.body;
        try {
            const prescription = await sequelize.query(
                `'SELECT medical_prescriptions.*, users.email FROM users, medical_prescriptions WHERE medical_prescriptions.user_id = users.id AND users.email = ${sequelize.escape(email)}`
            );
            res.status(201).send({
                msg: "Prescription fetched successfully!",
                prescription,
            });
        } catch (err) {
            res.status(500).send({
                msg: "Error fetching prescription!",
                err,
            });
        }
    }
);

export default router;