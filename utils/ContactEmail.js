const nodemailer = require("nodemailer");

const contactEmail = async (options) => {
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
    from: '"pinbuzzers 👻" <pinbuzzers@gmail.com>', // sender address
    to: "pinbuzzers@gmail.com",
    subject: options.subject,
    // text: options.message,
    html: `<div style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
      <h1 style="color: #333;">Hello!</h1>
      <p style="color: #555;">
        ${options.message}
      </p>
      <p style="color: #555;">Thank you for using our service!</p>
      <footer style="margin-top: 20px; font-size: 12px; color: #888;">
        <p>Best regards,</p>
        <p>Pinbuzzers Team</p>
        <p><a href="http://pinbuzzers.com" style="color: #007BFF; text-decoration: none;">Visit our website</a></p>
      </footer>
    </div>
  </div>
`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = contactEmail;
