const Factory = require("../utils/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Contact = require("../models/contactModel");
const contactEmail = require("../utils/ContactEmail");

exports.contactEnquiremail = catchAsync(async (req, res, next) => {
  const { name, email, number, subject, message } = req.body;

  if ((!name || !email || !number, !subject, !message)) {
    return next(new AppError("Please Provide Required filed", 400));
  }

  const newEnquire = await Contact.create({
    name,
    email,
    number,
    subject,
    message,
  });

  try {
    await contactEmail({
      email: email,
      subject: subject,
      message: `<h1> Enquery mail  </h1>
      <div> 
        <b>name </b> : ${name}
      </div>
       <div> 
        <b>subject </b> : ${subject}
      </div>
      <div> 
        <b>number </b> : ${number}
      </div>
       <div> 
        <b>email </b> : ${email}
      </div>
       <div> 
        <b>message </b> : ${message}
      </div>
          
      `,
    });

    res.status(200).json({
      status: "success",
      apiFor: "contact_mail",
      message: "contact Enquire mail send succesfully",
      // Don't send OTP or newUser details in the response
    });
  } catch (error) {
    console.log(error);
    return next(
      new AppError(
        "There was an error sending the email. Try again later.",
        500
      )
    );
  }
});

exports.getAllContactList = Factory.getAll(Contact);
