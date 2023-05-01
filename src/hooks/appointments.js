import sequelize from "../models/index.js";
import sendAppointmentNotification from "./notifications/appointments.js";
import getNext from "./queue.js";

export default async function getNextAppointments() {
  let item = await getNext("appointment");
  while (item) {
    const res = await sequelize.query(
      `SELECT * FROM appointments WHERE id = ${item.data.id}`
    );
    const patientRes = await sequelize.query(
      `SELECT * FROM users WHERE id = ${res[0][0].patientId}`
    );
    const patient = patientRes[0][0];
    const doctorRes = await sequelize.query(
      `SELECT * FROM users WHERE role = "doctor"`
    );
    const doctor = doctorRes[0][0];
    await sendAppointmentNotification({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      appointment: res[0][0],
    });
    await sendAppointmentNotification({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      appointment: res[0][0],
      patient: patient,
    });
    item = await getNext("appointment");
  }
}
