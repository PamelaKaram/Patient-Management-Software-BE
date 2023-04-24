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
    from: "email",
    to: email,
    subject: "Medicine Reminder",
    text: `Hello ${firstName} ${lastName},\n\n Don't forget to take your medicine in the following manner:\n\n ${medicineText}`,
  };

  await transporter.sendMail(mailOptions);
}
