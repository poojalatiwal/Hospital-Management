import mongoose from "mongoose";
export const dbConnection = () => {
  mongoose.connect(process.env.MONGO_URI, {
    dbName: "HospitalManagementSystem"
  }).then(() => {
    console.log("✅ connected to database");
    console.log("✅ DB NAME:", mongoose.connection.name);
    console.log("✅ HOST:", mongoose.connection.host);
  }).catch(err => {
    console.error("❌ Mongo error:", err.message);
  });
};
