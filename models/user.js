const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');


const userSchema= new Schema({
    email:{
        type:String,                /// in the case the passport loval mongoose add the hashed and salted usernama  as well as hashed salted password by itself
        required: true
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("user" , userSchema)