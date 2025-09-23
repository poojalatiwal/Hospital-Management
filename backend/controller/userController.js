import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Message } from "../models/messageSchema.js";
import { User } from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js"
import cloundinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,phone,password,gender,dob,nic,role} = req.body;
    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role){
        return next(new ErrorHandler("please fill complete form ",400))
    }
    let user = await User.findOne({email});
    if(user){
        return next(new ErrorHandler("user already registered!",400))

    }
    user = await User.create({firstName,lastName,email,phone,password,gender,dob,nic,role
        
    });
    generateToken(user,"User Registered!", 200 ,res);
});


export const login = catchAsyncErrors(async(req,res,next)=>{
    const {email,password,confirmPassword,role} = req.body;
    if(!email || !password || !confirmPassword || !role){
        return next(new ErrorHandler("please provide all details!",400))

    };
    if(password !== confirmPassword){
        return next(new ErrorHandler("password and confirmpassword donot match!",400));

    };
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid password or Email!",400));
    };

    const isPasswordMatched =  await user.confirmPassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid password or Email!",400));
    }

    if(role !== user.role ){
        return next(new ErrorHandler("User with this role not found!",400));
    };
    generateToken(user,"User logged in succesfully!", 200 , res);
});


export const addNewAdmin = catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,phone,password,gender,dob,nic} = req.body;
    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic){
        return next(new ErrorHandler("please fill complete form ",400))
    }

    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email already exists!`));
    }

    const admin = await User.create({firstName,lastName,email,phone,password,gender,dob,nic,role:"Admin"});
    res.status(200).json({
        success:true,
        message:"new admin registed",
    })

});


export const getAllDoctors = catchAsyncErrors(async(req,res,next)=>{
    const doctors = await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctors,
    })
});

export const getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success:true,
        user
    })

});

export const logoutAdmin = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("adminToken","",{httpOnly:true,expires:new Date(Date.now())}).json({
        success:true,
        message:"User Logged Out Succesfully!"
    })
});


export const logoutPatient = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("patientToken","",{httpOnly:true,expires:new Date(Date.now())}).json({
        success:true,
        message:"Patient Logged Out Succesfully!"
    })
});

export const addNewDoctor = catchAsyncErrors(async(req,res,next)=>{
    console.log("Received body:", req.body); // Log the received body
    console.log("Received files keys:", req.files ? Object.keys(req.files) : "No files found"); // Log available file keys

    // Check if files exist and have content
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Doctor Avatar Required",400));
    };

    // Check if docAvatar field exists in the uploaded files
    if(!req.files.docAvatar){
        console.log("Available file fields:", Object.keys(req.files));
        return next(new ErrorHandler("Doctor avatar file not found in upload. Expected field name: 'docAvatar'",400));
    }

    const {docAvatar} = req.files;
    
    // Check if docAvatar is defined and has the expected properties
    if(!docAvatar){
        return next(new ErrorHandler("Doctor avatar file is undefined",400));
    }

    // Check if the file has a mimetype property
    if(!docAvatar.mimetype){
        console.log("docAvatar object structure:", docAvatar);
        return next(new ErrorHandler("Invalid file upload - missing mimetype information",400));
    }

    const allowedFormats = ["image/png","image/jpeg","image/webp"];
    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler(`File format not supported. Received: ${docAvatar.mimetype}, Allowed: ${allowedFormats.join(", ")}`,400));
    };
    
    const {firstName,lastName,email,phone,password,gender,dob,nic,doctorDepartment}  = req.body;
    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment){
        return next(new ErrorHandler("Please provide full details",400));
    };
    
    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role}  already registered for this email`,400));
    };

    // Check if tempFilePath exists before uploading to Cloudinary
    if(!docAvatar.tempFilePath){
        console.log("docAvatar object:", docAvatar);
        return next(new ErrorHandler("Temporary file path not found. File upload may have failed.",400));
    }

    try {
        const cloudinaryResponse = await cloundinary.uploader.upload(docAvatar.tempFilePath);
        console.log("Cloudinary response:", cloudinaryResponse); // Log the Cloudinary response
        
        if(!cloudinaryResponse || cloudinaryResponse.error){
            console.log("Cloudinary error:", cloudinaryResponse?.error || "Unknown Cloudinary Error");
            return next(new ErrorHandler("Failed to upload image to Cloudinary",500));
        }
        
        const doctor = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            gender,
            dob,
            nic,
            doctorDepartment,
            role:"Doctor",
            docAvator:{
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url
            }
        });
        
        res.status(200).json({
            success:true,
            message:"New doctor registered",
            doctor
        });
    } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return next(new ErrorHandler("Failed to upload image to Cloudinary service",500));
    }
});


export const getAllMessage = catchAsyncErrors(async(req,res,next)=>{
    const messages = await Message.find();
    res.status(200).json({
        success:true,
        messages
    })
});
