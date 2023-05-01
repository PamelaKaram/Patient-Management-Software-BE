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

export const patientsSchema = {
  name: "patients",
  fields: [
    { name: "firstName", type: "string" },
    { name: "lastName", type: "string" },
    { name: "uuid", type: "string" },
  ],
};

export const patientsAccessSchema = {
  name: "patients_access",
  fields: [
    { name: "firstName", type: "string" },
    { name: "lastName", type: "string" },
    { name: "uuid", type: "string" },
    { name: "pharmacyUUIDs", type: "string[]" },
  ],
};

export const pharmaciesSchema = {
  name: "pharmacies",
  fields: [
    { name: "firstName", type: "string" },
    { name: "lastName", type: "string" },
    { name: "uuid", type: "string" },
  ],
};

export async function updatePatientSchema() {
  try {
    await client.collections("patients").delete();
    console.log("Deleting existing collection: patients");
  } catch (e) {
    console.log("On deleting patients: ", e);
  }

  client
    .collections()
    .create(patientsSchema)
    .then(function (data) {
      console.log(data);
    });

  let patientsData;
  //convert to JSON to be able to import to typesense
  try {
    patientsData = await sequelize.query(
      `SELECT JSON_ARRAYAGG(JSON_OBJECT('_id', id, 'firstName', firstName, 'lastName', lastName, 'uuid', uuid))
            FROM users WHERE role="patient";`
    );
  } catch (e) {
    console.log(e);
  }
  if (patientsData[0][0])
    client
      .collections("patients")
      .documents()
      .import(
        patientsData[0][0][
          "JSON_ARRAYAGG(JSON_OBJECT('_id', id, 'firstName', firstName, 'lastName', lastName, 'uuid', uuid))"
        ]
      );
}

export async function updatePharmacySchema() {
  try {
    await client.collections("pharmacies").delete();
    console.log("Deleting existing collection: pharmacies");
  } catch (e) {
    console.log("On deleting pharmacies: ", e);
  }

  client
    .collections()
    .create(pharmaciesSchema)
    .then(function (data) {
      console.log(data);
    });

  let pharmaciesData;
  //convert to JSON to be able to import to typesense
  try {
    pharmaciesData = await sequelize.query(
      `SELECT JSON_ARRAYAGG(JSON_OBJECT('_id', id, 'firstName', firstName, 'lastName', lastName, 'uuid', uuid))
            FROM users WHERE role="pharmacy";`
    );
  } catch (e) {
    console.log(e);
  }

  if (pharmaciesData[0][0])
    client
      .collections("pharmacies")
      .documents()
      .import(
        pharmaciesData[0][0][
          "JSON_ARRAYAGG(JSON_OBJECT('_id', id, 'firstName', firstName, 'lastName', lastName, 'uuid', uuid))"
        ]
      );
}

export async function updatePatientAccessSchema() {
  try {
    await client.collections("patients_access").delete();
    console.log("Deleting existing collection: patients_access");
  } catch (e) {
    console.log("On deleting patients: ", e);
  }

  client
    .collections()
    .create(patientsAccessSchema)
    .then(function (data) {
      console.log(data);
    });

  let patientsData;
  //convert to JSON to be able to import to typesense
  try {
    const patientsData = await sequelize.query(
      `SELECT JSON_ARRAYAGG(
        JSON_OBJECT('firstName', u.firstName, 'lastName', u.lastName, 'uuid', u.uuid, 'pharmacyUUIDs', (SELECT JSON_ARRAYAGG(pa.pharmacyUUID) FROM pharmacy_accesses pa WHERE pa.patientUUID = u.uuid))
    )
FROM users u 
WHERE u.role = 'patient';`
    );
    console.log(
      patientsData[0][0][
        "JSON_ARRAYAGG(\n        JSON_OBJECT('firstName', u.firstName, 'lastName', u.lastName, 'uuid', u.uuid, 'pharmacyUUIDs', (SELECT JSON_ARRAYAGG(pa.pharmacyUUID) FROM pharmacy_accesses pa WHERE pa.patientUUID = u.uuid))\n    )"
      ]
    );
  } catch (e) {
    console.log(e);
  }
  if (patientsData)
    client
      .collections("patients_access")
      .documents()
      .import(
        patientsData[0][0][
          "JSON_ARRAYAGG(\n        JSON_OBJECT('firstName', u.firstName, 'lastName', u.lastName, 'uuid', u.uuid, 'pharmacyUUIDs', (SELECT JSON_ARRAYAGG(pa.pharmacyUUID) FROM pharmacy_accesses pa WHERE pa.patientUUID = u.uuid))\n    )"
        ]
      );
}

updatePatientSchema();
updatePharmacySchema();
updatePatientAccessSchema();
