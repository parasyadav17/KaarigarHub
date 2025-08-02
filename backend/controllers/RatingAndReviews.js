const RatingAndReview = require("../models/RatingAndReviews");
const Job = require("../models/Job");
const { default: mongoose } = require("mongoose");

exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, jobId } = req.body;
    const jobDetails = await Job.find({
      _id: jobId,
      workersEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!jobDetails) {
      return res
        .status(404)
        .json({ success: false, emessage: "worker not enrolled in job" });
    }

    //checking for user already reviewed the job
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      job: jobId,
    });

    if (alreadyReviewed) {
      return res
        .status(403)
        .json({ success: false, message: "Already reviewed" });
    }

    //create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      job: jobId,
      user: userId,
    });

    //update job with rating and reviews
    const updatedJobDetails = await Job.findByIdAndUpdate(
      { _id: jobId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );
    console.log(updatedJobDetails);

    //return response
    res.status(200).json({
      success: true,
      message: "Rating added successfully",
      ratingReview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//avg rating
exports.getAverageRating = async (res, req) => {
  try {
    const jobId = req.body.jobId;
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          job: new mongoose.Types.ObjectId(jobId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({ averageRating: result[0].averageRating });
    } else {
      return res
        .status(200)
        .json({ message: "Average rating is 0", averageRating: 0 });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRating = async (req, res) => {
  //get sorted by rating
  try {
    const allReviews = await RatingAndReview.find()
      .sort({ rating: -1 })
      .populate({ path: "user", select: "firstName lastName email image" })
      .populate({ path: "job", select: "jobName" })
      .exec();

    return res.status(200).json({
      success: true,
      message: "all reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
