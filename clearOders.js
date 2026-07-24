import "dotenv/config";
import mongoose from "mongoose";
import orderModel from "./models/orderModel.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected");

    const result = await orderModel.deleteMany({});
    console.log(`Deleted ${result.deletedCount} orders`);

    process.exit();
  } catch (err) {
    console.error("Error clearing orders:", err);
    process.exit(1);
  }
};

run();