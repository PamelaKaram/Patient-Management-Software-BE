import transporter from "./index.js";

export default async function sendDailyNotifications({
  firstName,
  lastName,
  email,
  appointments,
}) {
  let text;

  text = `Hello Dr. ${firstName} ${lastName},\n\nYou have ${appointments.length} appointments tomorrow`;

  console.log(text);

  const mailOptions = {
    from: "drwalidpatientsoftware@outlook.com",
    to: email,
    subject: "Daily Notifications",
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
}