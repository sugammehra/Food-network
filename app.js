const { connect } = require("mongoose");

var express       =require("express"),
    app           =express(),
    mongoose      =require("mongoose"),
    bodyParser    =require("body-parser"),
    request = require("request"),
    passport      =require("passport"),
    LocalStrategy =require("passport-local"),
    User          =require("./views/models/User"),
    recipie       =require("./views/models/recipies")
const PORT = process.env.PORT || 5000;
 mongoose.connect("mongodb://localhost:27017/food",{useNewUrlParser:true});
//mongoose.connect("mongodb+srv://sugam:<pwd>@cluster0.jzv7t.mongodb.net/<dbname>",{useNewUrlParser:true},function(err,body){
mongoose.connect("mongodb+srv://sugam:sugam@cluster0.jzv7t.mongodb.net/food?retryWrites=true&w=majority",{useNewUrlParser:true})

//    if(error){
//        console.log(err);
//    } else{
//        console.log("database connected");
//    }
//});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs")


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








//Midle ware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

//=========================
//Passport Configuration
//===================================================
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
    next();
})






app.get("/",function(req,res){
    res.render("first")
});
app.get("/add",isLoggedIn,function(req,res){
    res.render("add");
})
app.get("/recipies",function(req,res){
    recipie.find({},function(err,allrecip){
        if(err){
            console.log(err);
        } else{
            res.render("recipies",{recipiess:allrecip})
        }
    })
})
app.get("/recipies/:id",isLoggedIn,function(req,res){
    recipie.findById(req.params.id,function(err,info){
        if(err){
            console.log(err)
        } else {
            res.render("info",{info:info})
        }
    })
})
app.post("/",function(req,res){
    var name=req.body.name
    var ingredients=req.body.ing
    var preparation=req.body.prep
    var img=req.body.image
    recipie.create({
        name:name,
        ingredients:ingredients,
        preparation:preparation,
        image:img,
    },function(err,dish){
        if(err){
            console.log(err);
        } else {
            console.log("dish added",dish)
        }
    });
   // recipie.save(function(err){
      //  if(err){
      //      console.log(err);
       // } else{
       ///    console.log("dish saved")
        //}
    //});
    res.redirect("/")
})
     
//=================
//AUTH ROUTES
//==================
app.get("/signup",function(req,res){
    res.render("signup")
})
app.post("/signup",function(req,res){
    var newUser=new User({username:req.body.username})
    User.register(newUser,req.body.password,function(err,body){
        if(err){
            console.log(err)
            res.send("Enter All the fields")
            res.redirect("/signup")
        } else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/")
            })
        }
    })
})
app.get("/login",function(req,res){
    res.render("login")
});
app.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
}),function(req,res){
}); 
app.get("/logout",function(req,res){
    req.logout()
    res.redirect("/")
})
app.get("*",function(req,res){
    res.send("ERROR 404: PAGE NOT FOUND")
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

