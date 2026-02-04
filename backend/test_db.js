const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URL;
console.log("-----------------------------------------");
console.log("Testing MongoDB Connection");
console.log("Raw URL from env:", url);
console.log("-----------------------------------------");

if (!url) {
    console.error("❌ MONGODB_URL is missing in .env file!");
    process.exit(1);
}

mongoose.connect(url)
    .then(() => {
        console.log("✅ SUCCESS! Connected to MongoDB.");
        console.log("This proves your URL and IP Whitelist are correct.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ FAILED! Could not connect.");
        console.error("Error Code Name:", error.codeName);
        console.error("Error Message:", error.message);
        console.log("-----------------------------------------");
        console.log("TROUBLESHOOTING:");
        if (error.codeName === 'AtlasError' || error.message.includes("bad auth")) {
            console.log("1. Check your USERNAME (kaarigar_admin) and PASSWORD (Kaarigar2025).");
            console.log("2. Did you recently change your password?");
            console.log("3. Try resetting your database user password in MongoDB Atlas and updating .env.");
        } else {
            console.log("1. Check your IP Whitelist in MongoDB Atlas.");
        }
        process.exit(1);
    });
