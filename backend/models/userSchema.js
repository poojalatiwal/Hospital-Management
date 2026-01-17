import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minLength: [3, "First name must contain at least 3 characters"]
  },

  lastName: {
    type: String,
    default: "",   // optional
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: true
  },

  phone: {
    type: String,
    required: [true, "Phone number is required"],
    minLength: [10, "Phone number must contain at least 10 digits"]
  },

  // ❌ NIC Removed  
  // ❌ DOB Removed

  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female","Other"]
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must be at least 8 characters long"],
    select: false
  },

  role: {
    type: String,
    required: true,
    enum: ["Admin", "Patient", "Doctor"], // kept as per your system
  },

  doctorDepartment: {
    type: String,
    default: "",
  },

  docAvatar: {
    public_id: String,
    url: String,
  }
});


// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// 🔐 Compare hashed passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// 🔐 Generate JWT token
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

export const User = mongoose.model("User", userSchema);
