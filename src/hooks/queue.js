import sequelize from "../models/index.js";

export default async function getNext(jobType) {
  const job = await sequelize.query(
    `SELECT * FROM queues
    WHERE beganProcessing IS NULL AND jobType = '${jobType}' 
    AND time < NOW() LIMIT 1`
  );
  if (job[0][0]) {
    const queue = await sequelize.query(
      `UPDATE queues SET beganProcessing = NOW() WHERE id = ${job[0][0].id}`
    );
    const res = await sequelize.query(
      `SELECT * FROM ${jobType}s WHERE id = ${job[0][0].data.id}`
    );
    return res[0][0];
  }
  return null;
}
