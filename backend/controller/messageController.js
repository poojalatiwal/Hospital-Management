import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js"

export const sendMessage = catchAsyncErrors(async(req,res,next)=>{
    // Check if req.body exists
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Request body is missing or not properly parsed"
        });
    }

    const {firstName,lastName,email,phone,message} = req.body;
    
    if(!firstName || !lastName || !email || !phone || !message){
        return next(new ErrorHandler("Please fill full form",400));
    }
    
    
        await Message.create({firstName,lastName,email,phone,message});
        res.status(200).json({
            success:true,
            message:"Message sent successfully!"
        });
})

export const getAllMessages = catchAsyncErrors(async(req,res,next)=>{
    const messages = await Message.find();
    res.status(200).json({
        success:true,
        messages
    }) 
})