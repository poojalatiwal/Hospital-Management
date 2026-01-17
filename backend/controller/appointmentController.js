import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";

/* ============================
   CREATE APPOINTMENT
============================ */
export const postAppointment = catchAsyncErrors(async (req, res, next) => {

  if (!req.user) {
    return next(new ErrorHandler("Please login to book appointment", 401));
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    department,
    hasVisited = false,
    address
  } = req.body;

  // ✅ Required fields check
  if (
    !firstName ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !address
  ) {
    return next(new ErrorHandler("Please fill all required fields", 400));
  }

  const patientId = req.user._id;

  await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    department,
    hasVisited,
    address,
    patientId
  });

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully!",
  });
});


/* ============================
   GET ALL APPOINTMENTS
============================ */
export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    appointments,
  });
});


/* ============================
   UPDATE APPOINTMENT STATUS
============================ */
export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  let appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  appointment = await Appointment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Appointment status updated!",
    appointment,
  });
});


/* ============================
   DELETE APPOINTMENT
============================ */
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully",
  });
});
