// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifySignature } = require("../controllers/Payments")
const { auth, isContractor, isWorker, isAdmin } = require("../midddlewares/auth")
router.post("/capturePayment", auth, isWorker, capturePayment)
router.post("/verifyPayment",auth,verifySignature)
router.post("/sendPaymentSuccessEmail", auth)

module.exports = router