import mysql from "mysql2";
import util from "util";
import * as dotenv from "dotenv";
dotenv.config();

const database = mysql.createConnection({
  host: process.env.DB_HOST_DEV,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD_DEV,
  database: process.env.DB_NAME,
});

database.query = util.promisify(database.query).bind(database);

database.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});

export default database;
