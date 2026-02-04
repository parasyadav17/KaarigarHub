const Contact = require("../models/Contact");
const mailSender = require("../utils/mailSender");

exports.contactUs = async (req, res) => {
  const { firstName, lastName, email, message, phoneNo } = req.body;
  if (!firstName || !email || !message) {
    return res.status(403).send({
      success: false,
      message: "All Fields are required",
    });
  }
  try {
    // Save to Database
    await Contact.create({
      firstName,
      lastName,
      email,
      contactNumber: phoneNo,
      message
    });

    const data = {
      firstName,
      lastName: `${lastName ? lastName : "null"}`,
      email,
      message,
      phoneNo: `${phoneNo ? phoneNo : "null"}`,
    };
    const info = await mailSender(
      process.env.CONTACT_MAIL || process.env.MAIL_USER,
      "Enquiry",
      `<html><body>${Object.keys(data).map((key) => {
        return `<p><strong>${key}:</strong> ${data[key]}</p>`;
      }).join("")}</body></html>`
    );
    if (info) {
      return res.status(200).send({
        success: true,
        message: "Your message has been sent successfully",
      });
    } else {
      return res.status(403).send({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    return res.status(403).send({
      success: false,
      message: "Something went wrong",
    });
  }
};