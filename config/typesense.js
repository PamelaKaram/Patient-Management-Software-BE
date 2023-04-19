import Typesense from "typesense";
import sequelize from "../src/models/index.js";
import * as dotenv from "dotenv";
dotenv.config();

export const client = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST, // For Typesense Cloud use xxx.a1.typesense.net
      port: process.env.TYPESENSE_PORT, // For Typesense Cloud use 443
      protocol: process.env.TYPESENSE_PROTOCOL, // For Typesense Cloud use https
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2,
});

export const usersSchema = {
  name: "users",
  fields: [
    { name: "firstName", type: "string" },
    { name: "lastName", type: "string" },
  ],
};

export async function updateTypesense() {
  try {
    await client.collections("users").delete();
    console.log("Deleting existing collection: users");
  } catch (e) {
    console.log("On deleting users: ", e);
  }

  client
    .collections()
    .create(usersSchema)
    .then(function (data) {
      console.log(data);
    });

  let usersData;
  //convert to JSON to be able to import to typesense
  try {
    usersData = await sequelize.query(
      `SELECT JSON_ARRAYAGG(JSON_OBJECT('_id', id, 'firstName', firstName, 'lastName', lastName))
            FROM users;`
    );
    console.log(
      usersData[0][0][
        "JSON_ARRAYAGG(JSON_OBJECT('_id', id, 'firstName', firstName, 'lastName', lastName))"
      ]
    );
  } catch (e) {
    console.log(e);
  }

  client
    .collections("users")
    .documents()
    .import(
      usersData[0][0][
        "JSON_ARRAYAGG(JSON_OBJECT('_id', id, 'firstName', firstName, 'lastName', lastName))"
      ]
    );
}

updateTypesense();
