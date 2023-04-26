import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import auth from "./routes/auth.js";
import appointments from "./routes/appointments.js";
import upload from "./routes/upload.js";
import medicine from "./routes/medicine.js";
import condition from "./routes/condition.js";
import questions from "./routes/questions.js";
import access from "./routes/pharmacyAccess.js";

import * as dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use("/api/v1/auth", auth);
app.use("/api/v1/appointments", appointments);
app.use("/api/v1/upload", upload);
app.use("/api/v1/medicine", medicine);
app.use("/api/v1/condition", condition);
app.use("/api/v1/questions", questions);
app.use("/api/v1/access", access);

app.use((err, res) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error: Invalid route";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

app.listen(port, () => console.log(`Express app running on port ${port}!`));
