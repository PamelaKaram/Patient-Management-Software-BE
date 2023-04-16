import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./router.js";

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

app.use("/api", router); //add versioning

app.use((err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

app.listen(port, () => console.log(`Express app running on port ${port}!`));
