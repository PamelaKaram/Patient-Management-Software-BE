import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
  service: "outlook",
  auth: {
    user: "jadaboukaram2002@hotmail.com",
    pass: "Jadmbw22",
  },
});

export default transporter;
