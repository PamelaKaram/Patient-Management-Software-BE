import express from "express";
import sequelize from "../models/index.js";
import authenticated from "../middlewares/authentication.js";
import isAuthorized from "../middlewares/authorization.js";
import Roles from "../enums/roles.js";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get(
    "/getHistory",
    authenticated,
    isAuthorized(Roles.DOCTOR),
    async (req, res) => {
        const {firstName, lastName} = req.body;
        try {
            const history = await sequelize.query(
                `SELECT medical_history.*, users.firstName, users.lastName FROM medical_history, users WHERE medical_history.user_id = users.id AND users.role="patient" AND users.firstName= ${sequelize.escape(firstName)} AND users.lastName= ${sequelize.escape(lastName)}`
            );
            res.status(200).send({
                msg: "History retrieved successfully!",
                history,
            });
        } catch (err) {
            res.status(500).send({
                msg: "Error retrieving history!",
                err,
            });
        }
    }
);