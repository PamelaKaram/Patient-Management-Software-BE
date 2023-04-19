import cron from "node-cron";

cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
});

// Documentation on how to use: https://www.npmjs.com/package/node-cron
