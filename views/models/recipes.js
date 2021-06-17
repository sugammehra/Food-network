var mongoose  =require("mongoose")

var RecipeSchema = new mongoose.Schema({
    name:String,
    image: {
        url:String, 
        filename: String
    },
    ingredients:String,
    preparation:String
});
module.exports= mongoose.model("Recipe",RecipeSchema)