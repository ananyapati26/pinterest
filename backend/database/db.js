import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL,{
        dbName: "printerest",
    });


    console.log("mongodb connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;