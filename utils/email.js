const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // let transporter = nodemailer.createTransport({
  //   host: process.env.BREVO_EMAIL_SMTP_Server,
  //   port: process.env.BREVO_EMAIL_PORT,
  //   auth: {
  //     user: process.env.BREVO_LOGIN, // generated ethereal user
  //     pass: process.env.BREVO_EMAIL_PASSWORD, // generated ethereal password
  //   },
  // });

  // Differentiate between development and production environments
  console.log("test email enviroment---", process.env.NODE_ENV);
  let transporter = nodemailer.createTransport({
    host:
      process.env.NODE_ENV === "production"
        ? process.env.BREVO_EMAIL_SMTP_Server
        : process.env.EMAIL_HOST,
    port:
      process.env.NODE_ENV === "production"
        ? process.env.BREVO_EMAIL_PORT
        : process.env.EMAIL_PORT,
    auth: {
      user:
        process.env.NODE_ENV === "production"
          ? process.env.BREVO_LOGIN
          : process.env.EMAIL_USER,
      pass:
        process.env.NODE_ENV === "production"
          ? process.env.BREVO_EMAIL_PASSWORD
          : process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"pinbuzzers 👻" <info@pinbuzzers.com>', // sender address
    to: options.email,
    subject: options.subject,
    // text: options.message,
    html: options.message, // html body
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
