const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: "7e3ce8001@smtp-brevo.com", // generated ethereal user
      pass: "5mKUWrPRTE8hAtwd", // generated ethereal password
    },
  });

  // Differentiate between development and production environments

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
