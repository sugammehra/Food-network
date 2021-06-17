var mongoose  =require("mongoose");

var Enquiry = new mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    phone:Number
});
module.exports= mongoose.model("Enquiry",Enquiry);