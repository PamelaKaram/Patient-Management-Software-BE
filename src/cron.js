import cron from "node-cron";
import getNextAppointments from "./hooks/appointments.js";
import getNextMedicine from "./hooks/medicines.js";
import sendWeeklyNotification from "./hooks/weekly-notifications.js";
import sendDailyNotification from "./hooks/daily-notifications.js";

export default function () {
  // runs every day at 6:00 am
  cron.schedule("0 6 * * *", async () => {
    await getNextAppointments();
    await getNextMedicine();
    await sendDailyNotification();
  });

  //runs every sunday
  cron.schedule("0 0 * * 0", async () => {
    await sendWeeklyNotification();
  });
}