import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
  service: "outlook",
  auth: {
    user: "drwalidpatientsoftware@outlook.com",
    pass: "PatientSoftware",
  },
});

export default transporter;
