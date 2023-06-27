import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log( process.env.MONGODB_URI)
    const conn = await mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true});
    console.log(
      `Conneted To Mongodb Databse ${conn.connection.host}`
    );
  } catch (error) {
    console.log(`Errro in Mongodb ${error}`);
  }
};

export default connectDB;