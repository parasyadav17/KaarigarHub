const Section = require("../models/Section");
const Job = require("../models/Job");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, jobId } = req.body;

    if (!sectionName || !jobId) {
      return res.status(400).json({
        success: false,
        message: "Section name and jobId are required",
      });
    }

    const newSection = await Section.create({ sectionName });

    // Update Job with new section and populate sections + their subsections
    const updatedJobDetails = await Job.findByIdAndUpdate(
      jobId,
      {
        $push: {
          jobContent: newSection._id,
        },
      },
      { new: true }
    ).populate({
      path: "jobContent", // this is your Section reference
      populate: {
        path: "subSection", // this is your SubSection reference inside Section
        model: "SubSection",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Section created and Job updated with populated data",
      data:updatedJobDetails,
    });
  } catch (error) {
    console.error("Create Section Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create section" });
  }
};

//update section
exports.updateSection = async (req, res) => {
  try {
    //data input
    const { sectionName, sectionId } = req.body;
    //data validatoion
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        // error:error.message,
        success: false,
        message: "Section name and sectionId are required",
      });
    }
    //update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    //return res
    return res.status(200).json({
      success: true,
      message: "Section updated succesfully",
      
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create section",
      error: error.message,
    });
  }
};

//delete section
exports.deleteSection = async (req, res) => {
  try {
    //get  id
    const { sectionId } = req.params;
    //dlt id
    await Section.findByIdAndDelete(sectionId);

    //return res
    return res.status(200).json({
      success: true,
      message: "Section deleted",
      // data:updatedJobDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete section",
      error: error.message,
    });
  }
};
