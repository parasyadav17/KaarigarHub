const Job = require("../models/Job");
const Category = require("../models/category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// ===========================
// CREATE JOB
// ===========================
exports.createJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobName, jobDescription, whatYouWillDo, rate, categoryId, location } =
      req.body;
    const thumbnail = req.files?.thumbnailImage;

    // Validate input
    if (
      !jobName ||
      !jobDescription ||
      !rate ||
      !categoryId ||
      !location ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check contractor
    const contractorDetails = await User.findOne({
      _id: userId,
      accountType: "Contractor",
    });
    if (!contractorDetails) {
      return res.status(404).json({
        success: false,
        message: "Contractor details not found",
      });
    }

    // Check category
    const categoryDetails = await Category.findById(categoryId);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
      });
    }

    // Upload thumbnail
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    if (!thumbnailImage || !thumbnailImage.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

    // Create Job
    const newJob = await Job.create({
      jobName,
      jobDescription,
      contractor: contractorDetails._id,
      whatYouWillDo: whatYouWillDo || "",
      rate,
      location,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: "Open",
    });

    // Add job to User and Category
    await User.findByIdAndUpdate(
      contractorDetails._id,
      { $push: { jobs: newJob._id } },
      { new: true }
    );

    await Category.findByIdAndUpdate(
      categoryDetails._id,
      { $push: { jobs: newJob._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Job added successfully",
      data: newJob,
    });
  } catch (error) {
    console.log("Job creation failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// ===========================
// GET ALL JOBS
// ===========================
exports.showAllJobs = async (req, res) => {
  try {
    const allJobs = await Job.find({})
      .populate("contractor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: allJobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch jobs data",
      error: error.message,
    });
  }
};

// ===========================
// GET SINGLE JOB DETAILS
// ===========================
exports.getJobDetails = async (req, res) => {
  try {
    const { jobId } = req.body;
    const jobDetails = await Job.find({ _id: jobId })
      .populate({
        path: "contractor",
        populate: {
          path: "additionalDetails",
        },
      })


      .exec();

    if (!jobDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find job with id: ${jobId}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job details fetched successfully",
      data: jobDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// GET JOBS BY CONTRACTOR
// ===========================
exports.getContractorJobs = async (req, res) => {
  try {
    const contractorId = req.user.id;
    const jobs = await Job.find({ contractor: contractorId })
      .populate({
        path: "applicants",
        populate: {
          path: "additionalDetails"
        }
      })
      .populate({
        path: "workersEnrolled",
        populate: {
          path: "additionalDetails"
        }
      })
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve contractor jobs",
      error: error.message,
    });
  }
};

// ===========================
// EDIT JOB
// ===========================
exports.editJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const updates = req.body;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (req.files?.thumbnailImage) {
      const thumbnailImage = await uploadImageToCloudinary(
        req.files.thumbnailImage,
        process.env.FOLDER_NAME
      );
      job.thumbnail = thumbnailImage.secure_url;
    }

    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        job[key] = updates[key];
      }
    }

    await job.save();

    const updatedJob = await Job.findById(jobId)
      .populate("contractor")
      .populate("category")
      .populate("ratingAndReviews")
      .exec();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ===========================
// DELETE JOB
// ===========================
exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const workersEnrolled = job.workersEnrolled;
    for (const workerId of workersEnrolled) {
      await User.findByIdAndUpdate(workerId, {
        $pull: { jobs: jobId },
      });
    }

    // For Job Board, we don't have sections/subsections to delete.
    // If we had unrelated models linked, we'd clean them here.


    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ===========================
// APPLY FOR JOB
// ===========================
exports.applyForJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.applicants.includes(userId)) {
      return res.status(400).json({ success: false, message: "Already applied" });
    }

    job.applicants.push(userId);
    await job.save();

    return res.status(200).json({
      success: true,
      message: "Applied successfully",
      data: job
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// ACCEPT APPLICATION
// ===========================
exports.acceptApplication = async (req, res) => {
  try {
    const { jobId, applicantId } = req.body;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Remove from applicants
    job.applicants = job.applicants.filter(id => id.toString() !== applicantId);

    // Add to workersEnrolled if not already there
    if (!job.workersEnrolled.includes(applicantId)) {
      job.workersEnrolled.push(applicantId);
    }

    await job.save();

    // Add job to Worker's jobs list if not already present (Optional, but good for "My Jobs" for worker)
    await User.findByIdAndUpdate(applicantId, { $addToSet: { jobs: jobId } });

    return res.status(200).json({
      success: true,
      message: "Application accepted",
      data: job
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// REJECT APPLICATION
// ===========================
exports.rejectApplication = async (req, res) => {
  try {
    const { jobId, applicantId } = req.body;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Remove from applicants
    job.applicants = job.applicants.filter(id => id.toString() !== applicantId);

    // Add to rejectedApplicants if not already there
    if (!job.rejectedApplicants.includes(applicantId)) {
      job.rejectedApplicants.push(applicantId);
    }

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Application rejected",
      data: job
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// GET APPLIED JOBS
// ===========================
exports.getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await Job.find({ applicants: userId })
      .populate("contractor")
      .populate("category")
      .exec();

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applied jobs",
      error: error.message,
    });
  }
};
