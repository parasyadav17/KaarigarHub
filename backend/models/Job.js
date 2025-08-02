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
    trype: String,
  },
  jobContent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },
  ratingAndReviews: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RatingAndReviews",
  },
  rate:{
    type:Number,
    
  },
  thumbnail:{
    type:String,

  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
  },
  workersEnrolled:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,

  }]
   
});

module.exports = mongoose.model("Job", jobSchema);
