import Sequelize from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  database: "patient_software",
  username: "root",
  password: "",
    host: "localhost",
    dialect: "mysql",
    port: 3306,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

export default sequelize;
