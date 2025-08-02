// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controller




// Job Controllers Import
const {
  createJob,
  // getAllJobs,
  getJobDetails,
  getContractorJobs,
  editJob,
  // getFullJobDetails,
  deleteJob,
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

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")

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
router.post("/createJob", auth, isContractor,createJob)
//Add a Section to a Job
router.post("/addSection", auth, isContractor, createSection)
// Update a Section
router.post("/updateSection", auth, isContractor, updateSection)
// Delete a Section
router.delete("/deleteSection", auth, isContractor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isContractor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isContractor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isContractor, createSubSection)
// Get all Registered Jobs
// router.get("/getAllJobs", getAllJobs)
// Get Details for a Specific Jobs
router.post("/getJobDetails", getJobDetails)
// Edit a Job
router.post("/editJob", auth, isContractor,isDemo, editJob)
// Get all Jobs of a Specific Contractor
router.get("/getContractorJobs", auth, isContractor, getContractorJobs)
//Get full Job details
// router.post("/getFullJobDetails", auth, getFullJobDetails)
// Delete a Job
router.delete("/deleteJob",auth,isDemo, deleteJob)
// Search Jobs
// router.post("/searchJob", searchJob);
//mark lecture as complete
// router.post("/updateJobProgress", auth, isWorker, markLectureAsComplete);




// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllcategories)
router.get("/getCategoryPageDetails", categoryPageDetails)
// router.post("/addJobToCategory", auth, isContractor, addJobToCategory);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isWorker,isDemo, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router;