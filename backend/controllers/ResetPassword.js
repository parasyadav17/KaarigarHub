const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetpasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from body
    const email = req.body.email;
    //check user for this mail , email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "Your email is not register with us",
      });
    }
    //generate token
    const token = crypto.randomBytes(20).toString("hex");
    //updateuser by adding token ad expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    );

    console.log("DETAILS", updatedDetails);
    //create url
    const url = `http://localhost:4000/update-password/${token}`;
    //send mail contaiining url

    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );
    //send res
    return res.json({
      success: true,
      message: "Link sent, please cehck email and reset password",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error:error.message,
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //validation
    if (password != confirmPassword) {
      return res.json({
        success: false,
        message: "Password not matching",
      });
    }
    //get user details
    const userDetails = await User.findOne({ token: token });
    //if no entry = invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "token is invalid",
      });
    }
    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired, please regenerate it",
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //pass update
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    //return res
    return res.status(200).json({
      success: true,
      message: "Password reset successfull",
    });
  } catch (error) {
   console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
