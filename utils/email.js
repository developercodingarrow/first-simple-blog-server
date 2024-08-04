const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  const mailOptions = {
    from: '"Fred Foo 👻" <firstwebsite@gmail.com>', // sender address
    to: options.email,
    subject: options.subject,
    // text: options.message,
    html: options.message, // html body
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
