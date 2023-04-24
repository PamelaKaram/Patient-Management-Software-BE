import transporter from "./index.js";

export default async function sendAppointmentNotification({
  firstName,
  lastName,
  email,
  appointment,
  patient,
}) {
  let text;

  if (patient) {
    text = `Hello Dr. ${firstName} ${lastName},\n\nYou have an appointment tomorrow at ${appointment.time} with ${patient.firstName} ${patient.lastName}.\n\n ${appointment.description}`;
  } else {
    text = `Hello ${firstName} ${lastName},\n\nYou have an appointment tomorrow at ${appointment.time}.\n\n ${appointment.description}`;
  }

  const mailOptions = {
    from: "email",
    to: email,
    subject: "Appointment Reminder",
    text: text,
  };

  await transporter.sendMail(mailOptions);
}
