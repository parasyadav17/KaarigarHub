// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controller




// Job Controllers Import
const {
  createJob,
  showAllJobs,
  getJobDetails,
  getContractorJobs,
  editJob,
  // getFullJobDetails,
  deleteJob,
  applyForJob,
  getAppliedJobs,
  // searchJob,
  // markLectureAsComplete,
} = require("../controllers/Job")


// Categories Controllers Import
const {
  showAllcategories,
  createCategory,
  categoryPageDetails,
  // addJobToCategory,
} = require("../controllers/Category")



// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReviews")

//demo
const { isDemo } = require("../midddlewares/demo");

// Importing Midddlewares
const { auth, isContractor, isWorker, isAdmin } = require("../midddlewares/auth")

// Jobs can Only be Created by Contractors
router.post("/createJob", auth, isContractor, createJob)

// Get all Registered Jobs
router.get("/getAllJobs", showAllJobs)
// Get Details for a Specific Jobs
router.post("/getJobDetails", getJobDetails)
// Edit a Job
router.post("/editJob", auth, isContractor, isDemo, editJob)
// Get all Jobs of a Specific Contractor
router.get("/getContractorJobs", auth, isContractor, getContractorJobs)
//Get full Job details
// router.post("/getFullJobDetails", auth, getFullJobDetails)
// Delete a Job
router.delete("/deleteJob", auth, isDemo, deleteJob)
// Search Jobs
// router.post("/searchJob", searchJob);
// Apply for a Job
router.post("/applyForJob", auth, isWorker, applyForJob);
router.get("/getAppliedJobs", auth, isWorker, getAppliedJobs);
router.post("/acceptApplication", auth, isContractor, require("../controllers/Job").acceptApplication);
router.post("/rejectApplication", auth, isContractor, require("../controllers/Job").rejectApplication);




// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllcategories)
router.get("/getCategoryPageDetails", categoryPageDetails)
// router.post("/addJobToCategory", auth, isContractor, addJobToCategory);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isWorker, isDemo, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router;