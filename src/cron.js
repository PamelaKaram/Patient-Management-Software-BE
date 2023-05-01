import cron from "node-cron";
import getNextAppointments from "./hooks/appointments.js";
import getNextMedicine from "./hooks/medicines.js";

export default function () {
  // runs every day at 6:00 am
  cron.schedule("0 6 * * *", async () => {
    await getNextAppointments();
    await getNextMedicine();
  });
}
