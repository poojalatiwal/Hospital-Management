import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First name must contain at least 3 characters"],
  },

  lastName: {
    type: String,
    // ✅ optional now
  },

  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },

  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone number must contain at least 10 digits"],
  },

  dob: {
    type: Date,
    required: [true, "DOB is required"],
  },

  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },

  appointment_date: {
    type: Date,   // ✅ better than String
    required: true,
  },

  department: {
    type: String,
    required: true,
  },

  hasVisited: {
    type: Boolean,
    default: false,
  },

  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },

}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
