import sequelize from "../models/index.js";
import sendNotification from "./notification.js";
import getNext from "./queue.js";

export default async function getNextAppointments() {
  let item = await getNext("appointment");
  while (item) {
    const res = await sequelize.query(
      `SELECT * FROM users WHERE id = ${item.patientId}`
    );
    const patient = res[0][0];
    const res2 = await sequelize.query(
      `SELECT * FROM users WHERE role = "doctor"`
    );
    const doctor = res2[0][0];
    console.log(patient);
    sendNotification({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      type: "appointment",
    });
    sendNotification({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      type: "appointment",
    });
    item = await getNext("appointment");
  }
}
