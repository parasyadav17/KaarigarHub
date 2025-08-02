// const mongoose = require("mongoose");
// require("dotenv").config();

// exports.connect = () =>{
//     mongoose.connect(process.env.MONGODB_URL, {
//         useNewUrlParser : true,
//         useUnifiedTopology : true,
//     })
//     .then(()=>console.log("DB Conneceted Successfully"))
//     .catch((error)=>{
//         console.log("DB Connection Failed");
//         console.log(error);
//         process.exit();
//     })
// };
const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("✅ DB Connected Successfully"))
    .catch((error) => {
      console.error("❌ DB Connection Failed");
      console.error(error);
      process.exit(1); // exit with failure code
    });
};
