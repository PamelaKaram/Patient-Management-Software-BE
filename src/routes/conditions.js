import express from "express";
import sequelize from "../models/index.js";
import authenticated from "../middlewares/authentication.js";
import isAuthorized from "../middlewares/authorization.js";
import Roles from "../enums/roles.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get(
    "/getMedicalCondition",
    authenticated,
    isAuthorized(Roles.DOCTOR),
    async (req, res) => {
        const {firstName, lastName} = req.body;
        try {
            const medicalCondition = await sequelize.query(
                `SELECT medical_conditions.*, users.first_name, users.last_name FROM medical_conditions, users WHERE medical_conditions.user_id=users.id AND users.first_name = ${sequelize.escape(firstName)} AND users.last_name = ${sequelize.escape(lastName)}  AND users.role="patient" ';`
            );
            res.status(200).send({
                msg: "Medical condition retrieved successfully!",
                medicalCondition,
            });
        } catch (err) {
            res.status(500).send({
                msg: "Error retrieving medical condition!",
                err,
            });
        }
    }
);

export default router;