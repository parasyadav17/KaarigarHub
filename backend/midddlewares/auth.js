const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer", "");

    //if token missing then return response
    if (!token) {
      return res.status(401).json({
        success: false.valueOf,
        message: "Token is missing",
      });
    }

    //verify token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      //verification - issue
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    console.log(token);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "spmething went wrong while validating the token",
    });
  }
};

//isWorker

exports.isWorker = async (req, res, next) => {
  try {
    if (req.user.accountType != "Worker") {
      return res.status(500).json({
        success: false,
        message: "This is protected route for Workers only",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cant be verified",
    });
  }
};

//isContractor

exports.isContractor = async (req, res, next) => {
  try {
    if (req.user.accountType != "Contractor") {
      return res.status(500).json({
        success: false,
        message: "This is protected route for Contractors only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cant be verified",
    });
  }
};

//isAdmin
exports.isAdmin= async (req, res, next) => {
  try {
    if (req.user.accountType != "Admin") {
      return res.status(500).json({
        success: false,
        message: "This is protected route for Admin only",
      });
      
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cant be verified",
    });
  }
};