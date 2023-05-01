import sequelize from "../models/index.js";
import sendDailyNotifications from "./notifications/daily-notifications.js";

export default async function sendDailyNotification() {
  //get doctor from database
  const doctor = await sequelize.query(
    `SELECT * FROM users WHERE role = "doctor"`
  );
  //get all appointments for tomorrow
  const appointments = await sequelize.query(
    `SELECT * FROM appointments WHERE date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 1 DAY)`
  );
  await sendDailyNotifications({
    firstName: doctor[0][0].firstName,
    lastName: doctor[0][0].lastName,
    email: doctor[0][0].email,
    appointments: appointments[0],
  });
}