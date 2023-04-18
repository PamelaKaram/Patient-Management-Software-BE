import * as dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD_TYPESENSE,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST_TYPESENSE,
    port: process.env.DB_PORT_TYPESENSE,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD_TYPESENSE,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST_TYPESENSE,
    port: process.env.DB_PORT_TYPESENSE,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD_TYPESENSE,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST_TYPESENSE,
    dialect: "mysql",
    port: process.env.DB_PORT_TYPESENSE,
  },
};
