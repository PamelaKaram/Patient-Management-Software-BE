import cron from "node-cron";

export default function () {
  cron.schedule("0 1 * * *", () => {
    console.log("Running a task every day at midnight");
  });
}
