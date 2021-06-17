var express=require("express");
var router=express.Router();
var passport=require("passport");
var User    =require("../views/models/User");



router.get("/",function(req,res){
    res.render("first")
});

//=================
//AUTH ROUTES
//==================

router.get("/signup",function(req,res){
    res.render("signup")
})
router.post("/signup",function(req,res){
    var newUser=new User({username:req.body.username})
    User.register(newUser,req.body.password,function(err,body){
        if(err){
            req.flash("error","Email already registered");
            res.redirect("/signup")
        } else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/");
            })
        }
    })
})
router.get("/login",function(req,res){
    req.flash("success","Logged in successfully");
    res.render("login",);
});
router.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash: 'Invalid login credentials',
}),function(req,res){
}); 
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})
module.exports=router;