// const SubSection = require("../models/SubSection");
// const Section = require("../models/Section");
// const Job = require("../models/Job");
// const { uploadImageToCloudinary } = require("../utils/imageUploader");

// //create subsection
// exports.createSubSection = async (req, res) => {
//   try {
//     //fetch data
//     const { sectionId, title, timeDuration, description, jobId } = req.body;
//     //extract file (edutech)video-->part(karigarhub)
//     const part = req.files.partFile;
//     //validate
//     if (
//       !sectionId ||
//       !title ||
//       !timeDuration ||
//       !description ||
//       !part ||
//       !jobId
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const ifsection = await Section.findById(sectionId);
//     if (!ifsection) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Section not found" });
//     }

//     //upload a part of job to cloudinary
//     const uploadDetails = await uploadImageToCloudinary(
//       part,
//       process.env.FOLDER_PART
//     );
//     console.log(uploadDetails);

//     //create subsection
//     const subSectionDetails = await SubSection.create({
//       title: title,
//       timeDuration: timeDuration,
//       description: description,
//       partUrl: uploadDetails.secure_url,
//     });
//     //update section with this subsection
//     const updatedSection = await Section.findByIdAndUpdate(
//       { _id: sectionId },
//       {
//         $push: {
//           subSection: subSectionDetails._id,
//         },
//       },
//       { new: true }
//     ).populate("subSection");

//     const updatedJob = await Job.findById(jobId)
//       .populate({ path: "jobContent", populate: { path: "subSection" } })
//       .exec();
//     //return res
//     return res.status(200).json({
//       success: true,
//       message: "Subsection created",
//       data: updatedJob,
//     });
//   } catch (error) {
//     console.error("Error creating new sub-section:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server error",
//       error: error.message,
//     });
//   }
// };

// //Update subsection
// exports.updateSubSection = async (req, res) => {
//   try {
//     // Extract necessary information from the request body
//     const { subSectionId, title, timeDuration, description, jobId } = req.body;
//     const part = req?.files?.partFile;

//     let uploadDetails = null;
//     // Upload the video file to Cloudinary
//     if (part) {
//       uploadDetails = await uploadImageToCloudinary(
//         part,
//         process.env.FOLDER_PART
//       );
//     }

//     // Create a new sub-section with the necessary information
//     const SubSectionDetails = await SubSection.findByIdAndUpdate(
//       { _id: subSectionId },
//       {
//         title: title || subSection.title,
//         // timeDuration: timeDuration,
//         description: description || SubSection.description,
//         partUrl: uploadDetails?.secure_url || SubSection.partUrl,
//       },
//       { new: true }
//     );

//     const updatedJob = await Job.findById(jobId)
//       .populate({ path: "jobContent", populate: { path: "subSection" } })
//       .exec();
//     // Return the updated section in the response
//     return res.status(200).json({ success: true, data: updatedJob });
//   } catch (error) {
//     // Handle any errors that may occur during the process
//     console.error("Error creating new sub-section:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// // Delete SubSection
// exports.deleteSubSection = async (req, res) => {
//   try {
//     const { subSectionId, sectionId } = req.body;

//     if (!subSectionId || !sectionId) {
//       return res.status(400).json({
//         success: false,
//         message: "subSectionId and sectionId required",
//       });
//     }

//     await SubSection.findByIdAndDelete(subSectionId);

//     const updatedSection = await Section.findByIdAndUpdate(
//       sectionId,
//       { $pull: { subSection: subSectionId } },
//       { new: true }
//     ).populate("subSection");

//     res.status(200).json({
//       success: true,
//       message: "SubSection deleted",
//       updatedSection,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Error deleting subsection",
//       error: err.message,
//     });
//   }
// };

const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const Job = require("../models/Job");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create Subsection
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description, jobId } = req.body;
    const part = req.files?.partFile;

    // Validation
    if (
      !sectionId ||
      !title ||
      !timeDuration ||
      !description ||
      !part ||
      !jobId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    const uploadDetails = await uploadImageToCloudinary(
      part,
      process.env.FOLDER_PART
    );

    const subSectionDetails = await SubSection.create({
      title,
      timeDuration,
      description,
      partUrl: uploadDetails.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    const updatedJob = await Job.findById(jobId)
      .populate({ path: "jobContent", populate: { path: "subSection" } })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Subsection created",
      data: updatedJob,
    });
  } catch (error) {
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update Subsection
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, timeDuration, description, jobId } = req.body;
    const part = req.files?.partFile;

    if (!subSectionId) {
      return res
        .status(400)
        .json({ success: false, message: "subSectionId is required" });
    }

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    let uploadDetails = null;
    if (part) {
      uploadDetails = await uploadImageToCloudinary(
        part,
        process.env.FOLDER_PART
      );
    }

    subSection.title = title || subSection.title;
    subSection.timeDuration = timeDuration || subSection.timeDuration;
    subSection.description = description || subSection.description;
    subSection.partUrl = uploadDetails?.secure_url || subSection.partUrl;

    await subSection.save();

    const updatedJob = await Job.findById(jobId)
      .populate({ path: "jobContent", populate: { path: "subSection" } })
      .exec();

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    console.error("Error updating subsection:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Delete SubSection
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId and sectionId are required",
      });
    }

    await SubSection.findByIdAndDelete(subSectionId);

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
      updatedSection,
    });
  } catch (error) {
    console.error("Error deleting subsection:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
