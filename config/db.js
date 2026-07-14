// import mongoose from "mongoose";
// export const connectDB=async()=>{
//     await mongoose.connect("mongodb://127.0.0.1:27017/tomato").then(()=>console.log("DB connected"))
// }

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
};