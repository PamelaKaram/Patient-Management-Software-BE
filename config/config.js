import * as dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST_DEV,
    dialect: "mysql",
  },
};
