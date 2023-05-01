import transporter from "./index.js";

export default async function sendMedicineNotification({
  firstName,
  lastName,
  email,
  medicines,
}) {
  const medicineText = medicines
    .map((medicine) => {
      return `${medicine.medicine} - ${medicine.frequency} time/day - ${medicine.foodTiming} food - ${medicine.description}`;
    })
    .join("\n");

  const mailOptions = {
    from: "drwalidpatientsoftware@outlook.com",
    to: email,
    subject: "Medicine Reminder",
    text: `Hello ${firstName} ${lastName},\n\n Don't forget to take your medicine in the following manner:\n\n ${medicineText}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
}
