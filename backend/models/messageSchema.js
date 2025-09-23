import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"first name contain atleast three character"]
    },
    lastName:{
        type:String,
        required:true,
        minLength:[3,"last name contain atleast three character"]
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"Please provide a valid email"]
    },
    phone:{
        type:String,
        required:true,
        minLength:[11,"phone number must contain 11 numbers"]
    },
    message:{
        type:String,
        required:true,
        minLength:[3,"message must contain atleast 10 character"]
    }
})
export const Message = mongoose.model("Message",messageSchema) 