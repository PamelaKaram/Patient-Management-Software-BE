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
        const { patientUUId } = req.query;
        try {
            const [history] = await sequelize.query(
                `SELECT * 
                FROM medical_histories
                WHERE medical_histories.patientUUId = ${sequelize.escape(patientUUId)};`
            );
            res.status(200).send({
                msg: "History retrieved successfully!",
                history,
            });
        } catch (err) {
            res.status(500).send({
                msg: "Error retrieving history!",
                err: err.message,
            });
        }
    }
);


export default router;
