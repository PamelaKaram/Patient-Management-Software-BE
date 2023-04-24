import sequelize from "../models/index.js";
import transporter from "./notifications/index.js";
import sendMedicineNotification from "./notifications/medicines.js";
import getNext from "./queue.js";

export default async function getNextMedicine() {
  let item = await getNext("medicine");
  console.log(item);
  while (item) {
    console.log(item.data.id);
    const res = await sequelize.query(
      `SELECT * FROM medicines WHERE prescriptionId = ${item.data.id}`
    );
    const medicines = res[0];
    const patientRes = await sequelize.query(
      `SELECT * FROM users WHERE id = ${item.data.id}`
    );
    const patient = patientRes[0][0];

    const tomorrow = new Date(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);
    // send medicine reminder at 5am
    const dateTime = new Date(
      tomorrow.toISOString().split("T")[0] + "T" + "05:00:00" + "Z"
    );
    await sequelize.query(
      `INSERT INTO queues (jobType, data, time, createdAt, updatedAt) VALUES ('medicine', '{"id": ${
        item.data.id
      }}', ${sequelize.escape(dateTime)}, '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}', '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}');`
    );

    await sendMedicineNotification({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      medicines: medicines,
    });

    item = await getNext("medicine");
  }
}
