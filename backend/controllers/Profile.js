const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (require, res) => {
  try {
    //fetch data
    const {
      dateOfBirth = "",
      about = "",
      contactNumber,
      gender,
      companyName,
    } = require.body;
    //fetch user
    const id = require.user.id;
    //validate
    if (!contactNumber || !gender || !companyName || !dateOfBirth || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }
    //find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);
    //update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    profileDetails.companyName = companyName;
    await profileDetails.save();
    //return res
    return res.status(200).json({
      success: true,
      message: "profile updated ",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      //   message: "Failed to update profile",
      error: error.message,
    });
  }
};

//delete profile

exports.deleteAccount = async (req, res) => {
  try {
    //get id
    const id = req.user.id;
    //vslidate
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User Not found",
      });
    }
    //delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    //delete user
    await User.findByIdAndDelete({ _id: id });
    //return res

    return res.status(200).json({
      success: true,
      message: "Successfully deleted the profile",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "User cannot be deleted",
    });
  }
};

//get all usr details

exports.getAllUserDetails = async (req, res) => {
  try {
    //get user id
    const id = req.user.id;
    //vakidation
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    //response
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
