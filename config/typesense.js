import Typesense from "typesense";
import sequelize from "../src/models/index.js";

let client = new Typesense.Client({
  nodes: [
    {
      host: "typesense", // For Typesense Cloud use xxx.a1.typesense.net
      port: "8108", // For Typesense Cloud use 443
      protocol: "http", // For Typesense Cloud use https
    },
  ],
  apiKey: "xyz",
  connectionTimeoutSeconds: 2,
});

let usersSchema = {
  name: "users",
  fields: [
    { name: "firstName", type: "string" },
    { name: "lastName", type: "string" },
  ],
};

try {
  await client.collections("users").delete();
  console.log("Deleting existing collection: users");
} catch (error) {
  // Do nothing
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
    `SELECT JSON_ARRAYAGG(JSON_OBJECT('_id', id, 'firstName', firstName, 'lastName', lastName, 'email', email))
      FROM users;`
  );
  console.log(
    usersData[0][0][
      "JSON_ARRAYAGG(JSON_OBJECT('_id', id, 'firstName', firstName, 'lastName', lastName, 'email', email))"
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
      "JSON_ARRAYAGG(JSON_OBJECT('_id', id, 'firstName', firstName, 'lastName', lastName, 'email', email))"
    ]
  );

let searchParameters = {
  q: "a",
  query_by: "firstName",
};

client
  .collections("users")
  .documents()
  .search(searchParameters)
  .then(function (searchResults) {
    console.log(searchResults);
  });

export default client;
