const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();
// const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

//send otp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from req body
    const { email } = req.body;

    //check if user already exists
    const checkUserPresent = await User.findOne({ email });

    //if exists then return false response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP Generator :", otp);

    //check unique otp or not
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    //create an entry in DB
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "OTP Sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//signup
exports.signUp = async (req, res) => {
  try {
    //data fetch from body
    

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
      location,
      
    } = req.body;

    //validate data
    if (!firstName || !lastName || !email || !password || !otp || !location) {
      return res.status(420).json({
        success: false,
        message: "All fields are required",
      });
    }

    //2 passwords match krlo
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords does not match, try again",
      });
    }

    //check user already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already exists",
      });
    }

    //find most recent otp
    const response = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);

    if (response.length === 0) {
      return res.status(400).json({
        error:error.message,
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== response.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //hash pass
    const hashedPassword = await bcrypt.hash(password, 10);
    //entry in db

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

  const user = await User.create({
  firstName,
  lastName,
  email,
  password: hashedPassword,
  accountType,
  additionalDetails: profileDetails._id,
  contactNumber,
  image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
  location, // ✅ Must be included
  skills: req.body.skills || [], // ✅ Optional if accountType is Worker
});


    //return response
    return res.status(200).json({
      success: true,
      message: "User registered successfuly",
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "User cant be registered, please try again later",
      error: error.message,
    });
  }
};

//login

exports.login = async (req, res) => {
  try {
    //get data from req body
    const { email, password } = req.body;

    //validate data

    if (!email || !password) {
      return res.status(400).json({
        sucess: false,
        message: "All fields are required",
      });
    }

    //checkk user
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        sucess: false,
        message: "User is not registerd",
      });
    }

    //generate token, after password matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie
      const options = {
        expire: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged In successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Login failed, please try again",
    });
  }
};

//changepassword

exports.changePassword = async (req, res) => {
  try {
    // Step 1: Get data from request body
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    // Step 2: Validate inputs
    if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Step 3: Fetch user using email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 4: Compare old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Step 5: Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Step 6: Send success response
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error in changePassword:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    });
  }
};

// exports.changePassword = async (req, res)={
//     //get data from body
//     //get oldpass, newpass, confirmnew,
//     //validation

//     //update pwd in db
//     //send mail
//     //return response

// }
