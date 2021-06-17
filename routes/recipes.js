var express   =require("express"),
    router    =express.Router(),
    multer    =require("multer"),
    {storage}   =require("../cloudinary"),
    upload      =multer({storage});
    
var recipe    =require("../views/models/recipes");
var Enquiry   =require("../views/models/enquiry");

//Midle ware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First");
    res.redirect("/login")
}

router.get("/add",isLoggedIn,function(req,res){
    res.render("add");
})
router.get("/join",function(req,res){
    res.render("join");
})
router.post("/join",function(req,res){
    var fname=req.body.fname
    var lname=req.body.lname
    var email=req.body.email
    var phone=req.body.phone
    Enquiry.create({
        fname:fname,
        lname:lname,
        email:email,
        phone:phone
    },function(err,enquiry){
        if(err){
            console.log(err);
        } else {
            console.log("enquiry submitted",enquiry)
        }
    });
    req.flash('success', ' Thanks!,We will contact you shortly');
    res.redirect("join");
})
router.get("/recipes",function(req,res){
    recipe.find({},function(err,allrecip){
        if(err){
            console.log(err);
        } else{
            res.render("recipes",{recipes:allrecip})
        }   
    })
})
router.get("/recipes/:id",isLoggedIn,function(req,res){
    recipe.findById(req.params.id,function(err,info){
        if(err){
            console.log(err)
        } else {
            res.render("info",{info:info})
        }
    })
})

router.post("/",upload.single('image'),async(req,res) =>{
    try{
        console.log(req.body,req.files);
    }  catch(err){
        console.log(err);
    }finally{
    var name=req.body.name
    var ingredients=req.body.ing
    var preparation=req.body.prep
    var img={url:req.file.path,filename:req.file.filename}
    recipe.create({
        name:name,
        ingredients:ingredients,
        preparation:preparation,
        //image:img,
        image:img
    });
    // function(err,dish){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         console.log("dish added",dish)
    //     }
    // });
    req.flash("success","Recipe Added Successfully");
    res.redirect("/")
}
})
module.exports=router;
     