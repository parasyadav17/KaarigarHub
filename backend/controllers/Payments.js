const { instance } = require("../config/razorpay");
const Job = require("../models/Job");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const crypto = require("crypto");
const {
  jobEnrollementEmail,
} = require("../mail/templates/jobEnrollmentEmail");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");



exports.capturePayment = async (req, res) => {
  //get jobid and useerid
  const { job_id } = req.body;
  const { userId } = req.body;
  //validate
  //valid jobId
  if (!job_id) {
    return res.json({
      success: false,
      message: "please provide valid job id",
    });
  }
  //valid jobdetail
  let job;
  try {
    job = await Job.findById(job_id);
    if (!job) {
      return res.json({
        success: false,
        message: "could not find the job",
      });
    }





    
    //user already pay for same job
    const uid = new mongoose.Types.ObjectId(userId);
    if (job.workersEnrolled.includes(uid)) {
      return res.json({
        success: false,
        message: "Worker is already enrolled",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  //order create
  const amount = job.rate;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      jobId: job_id,
      userId,
    },
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    //return response
    return res.status(200).json({
      success: true,
      jobName: job.jobName,
      jobDescription: job.jobDescription,
      thumnail: job.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "could not initiate order",
    });
  }
};

//verify signature of razorpay and server
exports.verifySignature = async (req, res) => {
  const webhookSecret = "12345678";

  const signature = req.headers["x-razorpay-signature"];
  crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment is authorized");

    const { jobId, userId } = req.body.payload.payment.entity.notes;

    try {
      //fulfill actions

      //find job and enroll the worker
      const enrolledJob = await Job.findOneAndUpdate(
        { _id: jobId },
        { $push: { workersEnrolled: userId } },
        { new: true }
      );
      if (!enrolledJob) {
        return res.status(500).json({
          success: false,
          message: "Job not found",
        });
      }

      console.log(enrolledJob);

      //find the workers and add job to list of enrolled jobs
      const enrolledWorker = await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { jobs: jobId } },
        { new: true }
      );

      console.log(enrolledWorker);

      //mail send
      const emailResponse = await mailSender(
        enrolledWorker.email,
        `Successfully Enrolled into ${enrolledJob}`,
        emailTemplate
      );
      console.log(emailResponse);
      return res.status(200).json({
        success: false,
        message: "Signature verified and job added ",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    return res.status(540).json({
      success: false,
      message: "Invalid request",
    });
  }
};
