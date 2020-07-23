var mongoose  =require("mongoose")

var RecipieSchema = new mongoose.Schema({
    name:String,
    image:String,
    ingredients:String,
    preparation:String
});
module.exports= mongoose.model("Recipie",RecipieSchema)