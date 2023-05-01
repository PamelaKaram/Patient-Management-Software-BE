import transporter from "./index.js";

export default async function sendWeeklyNotifications({
  firstName,
  lastName,
  email,
  appointments,
}) {
  let text;

  text = `Hello Dr. ${firstName} ${lastName},\n\nYou have ${appointments.length} appointments next week`;

  console.log(text);

  const mailOptions = {
    from: "drwalidpatientsoftware@outlook.com",
    to: email,
    subject: "Weekly Notification",
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
}