import sequelize from "../models/index.js";
import sendAppointmentNotification from "./notifications/appointments.js";
import sendWeeklyNotifications from "./notifications/weekly-notifications.js";
import getNext from "./queue.js";

export default async function sendWeeklyNotification() {
  //get doctor from database
  const doctor = await sequelize.query(
    `SELECT * FROM users WHERE role = "doctor"`
  );
  //get all appointments for next week
  const appointments = await sequelize.query(
    `SELECT * FROM appointments WHERE date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)`
  );
  await sendWeeklyNotifications({
    firstName: doctor[0][0].firstName,
    lastName: doctor[0][0].lastName,
    email: doctor[0][0].email,
    appointments: appointments[0],
  });
}
