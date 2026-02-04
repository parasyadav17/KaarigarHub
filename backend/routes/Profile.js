const express = require("express")
const router = express.Router()
const { auth, isContractor } = require("../midddlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  // updateDisplayPicture,
  // getEnrolledJobs,
  // contractorDashboard,
} = require("../controllers/Profile")
const { isDemo } = require("../midddlewares/demo");

// Delet User Account
router.delete("/deleteProfile",auth,deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Jobs
// router.get("/getEnrolledJobs", auth, getEnrolledJobs)
// router.put("/updateDisplayPicture", auth,isDemo, updateDisplayPicture)
//get contractor dashboard details
router.get("/getContractorDashboardDetails",auth,isContractor) 
// addcontractorDashboard

module.exports = router;