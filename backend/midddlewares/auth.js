const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    // Extract token from cookies, body, or Authorization header
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user info to request
      next(); // Move to next middleware/controller
    } catch (error) {
      // Token verification failed
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }
  } catch (error) {
    // General error during auth process
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};


//isWorker

exports.isWorker = async (req, res, next) => {
  try {
    if (req.user.accountType != "Worker") {
      return res.status(403).json({
        success: false,
        message: "This is protected route for Workers only",
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
exports.isAdmin = async (req, res, next) => {
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