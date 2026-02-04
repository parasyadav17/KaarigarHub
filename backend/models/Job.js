const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobName: {
    type: String,
    required: true,
    trim: true,
  },
  jobDescription: {
    type: String,
    required: true,
    trim: true,
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whatYouWillDo: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "Assigned", "Completed"],
    default: "Open",
  },
  ratingAndReviews: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RatingAndReviews",
  },
  rate: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  workersEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  rejectedApplicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Job", jobSchema);
