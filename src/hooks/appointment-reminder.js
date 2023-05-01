import sequelize from "../models/index.js";
import sendMedicineNotification from "./notifications/medicines.js";
import getNext from "./queue.js";

export default async function getNextAppointmentReminder() {
  let item = await getNext("appointmentReminder");
  while (item) {
    //get patient using patientUUID
    const patient = await sequelize.query(
      `SELECT * FROM users WHERE uuid = ${item.data.patientUUID}`
    );
    await sendMedicineNotification({
      firstName: patient[0][0].firstName,
      lastName: patient[0][0].lastName,
      email: patient[0][0].email,
      medicines: medicines,
    });

    item = await getNext("appointmentReminder");
  }
}