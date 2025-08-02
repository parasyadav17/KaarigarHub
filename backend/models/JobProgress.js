const mongoose = require("mongoose");

const jobProgress = new mongoose.Schema({
  
    jobID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",

    },
    completedJobs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }
    ]


});

module.exports = mongoose.model("JobProgress", jobProgress);
