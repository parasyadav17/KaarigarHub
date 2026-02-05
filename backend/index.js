const express = require("express");
const app = express();
require("dotenv").config();


const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const jobRoutes = require("./routes/Job");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { cloudnairyconnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 4000;

//databse commect
database.connect();
//midddlewares
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  process.env.FRONTEND_URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
)


cloudnairyconnect();
//cloudinary connection
app.use("/api/v1/auth", userRoutes)

app.use("/api/v1/profile", profileRoutes)

app.use("/api/v1/payment", paymentRoutes)

app.use("/api/v1/job", jobRoutes)

app.use("/api/v1/contact", require("./routes/ContactUs"));
app.use("/api/v1/admin", require("./routes/Admin"));



//def route

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});