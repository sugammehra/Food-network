if(process.env.NODE_ENV!=="production"){
  require("dotenv").config();
}
console.log(process.env.SECRET);

// const { connect } = require("mongoose");
// const { join } = require("path");

var express       =require("express"),
    app           =express(),
    mongoose      =require("mongoose"),
    bodyParser    =require("body-parser"),
    request       =require("request"),
    passport      =require("passport"),
    LocalStrategy =require("passport-local"),
    fs            =require('fs'),//new
    flash         =require('connect-flash'),
    path          =require("path"),
    User          =require("./views/models/User")
   
    
    

    
var recipeRoutes  =require("./routes/recipes"),
    indexRoutes    =require("./routes/index");
const PORT = process.env.PORT || 5000;
 //mongoose.connect("mongodb://localhost:27017/food",{useNewUrlParser:true});
//mongoose.connect("mongodb+srv://sugam:<pwd>@cluster0.jzv7t.mongodb.net/<dbname>",{useNewUrlParser:true},function(err,body){
//mongoose.connect("mongodb+srv://sugam:sugam@cluster0.jzv7t.mongodb.net/food?retryWrites=true&w=majority",{useNewUrlParser:true})
mongoose.connect("mongodb://sugam:sugam@cluster0-shard-00-00.jzv7t.mongodb.net:27017,cluster0-shard-00-01.jzv7t.mongodb.net:27017,cluster0-shard-00-02.jzv7t.mongodb.net:27017/food?ssl=true&replicaSet=atlas-mbj4l5-shard-0&authSource=admin&retryWrites=true&w=majority",{useNewUrlParser:true})
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set("view engine","ejs");
app.use(flash());


//var options = {
//  method: 'POST',
  //url: 'https://worldwide-recipes.p.rapidapi.com/api/yummly/recipe/typeahead',
//  headers: {
  //  'x-rapidapi-host': 'worldwide-recipes.p.rapidapi.com',
    //'x-rapidapi-key': '2ca3b4fb54msh890cd8d1ddb094dp1e99e2jsneaac43d63e9b',
//    'content-type': 'application/x-www-form-urlencoded',
 //   useQueryString: true
 // },
 // form: {q: 'pizza'}
//};

//app.get("/search",function(req,res){
  //  var query=req.query.search;
    //request(options, function (error, response, body){
//        if(!error && response.statusCode==200){
  //          var data=JSON.parse(body);
    //        res.render("search",{data:data});
      //      console.log(body);
        //}
  //  })
//});


//==================================
//Passport Configuration
//===================================
app.use(require("express-session")({
    secret:"this will get encode and decode",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=======================================================

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
})

// Importing Routes
app.use(indexRoutes);
app.use(recipeRoutes);


app.get("*",function(req,res){
    res.send("ERROR 404: PAGE NOT FOUND")
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

