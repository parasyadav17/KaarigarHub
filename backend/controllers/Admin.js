const User = require("../models/User");
const Job = require("../models/Job");
const Contact = require("../models/Contact");


exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalWorkers = await User.countDocuments({ accountType: "Worker" });
        const totalContractors = await User.countDocuments({ accountType: "Contractor" });
        const totalJobs = await Job.countDocuments();

        // Fetch ALL users and ALL jobs
        const allUsers = await User.find().populate("additionalDetails").sort({ createdAt: -1 });
        const allJobs = await Job.find().sort({ createdAt: -1 });
        const allMessages = await Contact.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalWorkers,
                totalContractors,
                totalJobs,
                allUsers,
                allJobs,
                allMessages
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin stats",
            error: error.message
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate("additionalDetails").exec();
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        await User.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "User User Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message
        });
    }
}

exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.body;
        await Contact.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Message Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete message",
            error: error.message
        });
    }
}
