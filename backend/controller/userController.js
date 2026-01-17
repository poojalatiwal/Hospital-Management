import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Message } from "../models/messageSchema.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";


/* =======================
   PATIENT REGISTER
======================= */
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, gender, role } = req.body;

  if (!firstName || !email || !phone || !password || !gender || !role) {
    return next(new ErrorHandler("Please fill complete form", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already registered!", 400));
  }

  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    role
  });

  generateToken(user, "User Registered Successfully!", 200, res);
});


/* =======================
   LOGIN
======================= */
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide all details!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password!", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password!", 400));
  }

  if (role !== user.role) {
    return next(new ErrorHandler("User with this role not found!", 400));
  }

  generateToken(user, "User logged in successfully!", 200, res);
});


/* =======================
   ADD ADMIN
======================= */
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, gender } = req.body;

  if (!firstName || !email || !phone || !password || !gender) {
    return next(new ErrorHandler("Please fill complete form", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler(`${isRegistered.role} already exists!`, 400));
  }

  await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    role: "Admin"
  });

  res.status(200).json({
    success: true,
    message: "New admin registered",
  });
});


/* =======================
   GET ALL DOCTORS
======================= */
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});


/* =======================
   GET USER DETAILS
======================= */
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});


/* =======================
   LOGOUT
======================= */
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res.status(200)
    .cookie("adminToken", "", { httpOnly: true, expires: new Date(Date.now()) })
    .json({
      success: true,
      message: "Admin Logged Out Successfully!"
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res.status(200)
    .cookie("patientToken", "", { httpOnly: true, expires: new Date(Date.now()) })
    .json({
      success: true,
      message: "Patient Logged Out Successfully!"
    });
});


/* =======================
   ADD NEW DOCTOR
======================= */
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {

  if (!req.files || !req.files.docAvatar) {
    return next(new ErrorHandler("Doctor avatar required", 400));
  }

  const { docAvatar } = req.files;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File format not supported", 400));
  }

  const { firstName, lastName, email, phone, password, gender, doctorDepartment } = req.body;

  if (!firstName || !email || !phone || !password || !gender || !doctorDepartment) {
    return next(new ErrorHandler("Please provide full details", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler(`${isRegistered.role} already registered with this email`, 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);

  if (!cloudinaryResponse) {
    return next(new ErrorHandler("Image upload failed", 500));
  }

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    doctorDepartment,
    role: "Doctor",
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url
    }
  });

  res.status(200).json({
    success: true,
    message: "New doctor registered",
    doctor
  });
});


/* =======================
   GET ALL MESSAGES
======================= */
export const getAllMessage = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages
  });
});
