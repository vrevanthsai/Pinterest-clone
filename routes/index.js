var express = require('express');
var router = express.Router();
// import mongodb-usermodel
const userModel = require("./users");
//import postmodel 
const postModel = require("./posts");
// include passport and its setup
const passport = require('passport');
// import multer file
const upload=require("./multer");

// these 2 line helps for user to login
const localStrategy=require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pinterest-Clone' });
});
// profile route
router.get("/profile",isLoggedIn ,async function(req,res,next){
  // sending user data to profile page
  const user=await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts") //to send post data seperately
  // console.log(user);
  res.render("profile",{user});
})
// login form page router 
router.get("/login" ,function(req,res,next){
  // accessing flash msgs 
  // console.log(req.flash('error')); 
  res.render("login",{error:req.flash('error')});
})
// feed route
router.get("/feed",isLoggedIn ,async function(req,res,next){
  const user=await userModel.findOne({
    username: req.session.passport.user
  })
  const posts=await postModel.find()
  .populate("user") 
  res.render("feed",{user,posts});
})
// createpost route
router.get("/createpost",isLoggedIn ,function(req,res){
  res.render("createpost")
})

// uploads post route for uploading posts
router.post('/upload',isLoggedIn ,upload.single("postfile"),async function(req,res){
  if(!req.file){
    return res.status(404).send("No files were given");
  }
  // res.send("File uploaded successfully");
  const user = await userModel.findOne({username:req.session.passport.user});
  const post= await postModel.create({
    image:req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });
  // to add postid to its user
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
  // res.send('done');
});

// fileupload post route for changing profile pic or dp
router.post('/fileupload',isLoggedIn ,upload.single("profileimg"),async function(req,res){
  if(!req.file){
    return res.status(404).send("No files were given");
  }
  const user = await userModel.findOne({username:req.session.passport.user});
  // to add path of uploaded profile-pic to user-db 
  user.dp=req.file.filename;
  await user.save();
  res.redirect("/profile");
  // res.send("done");
});
// allpins route
router.get("/profile/allpins",isLoggedIn ,async function(req,res,next){
  // sending user data to profile page
  const user=await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts") //to send post data seperately
  // console.log(user);
  res.render("allpins",{user});
})

// register route
router.post("/register",function(req,res){
  // normal way
  // const userData = new userModel({
  //   username: req.body.username,
  //   email: req.body.email,
  //   fullName: req.body.fullName,
  // });
  // reduced coded for register route userData from chatgpt
  // const userData = new userModel({ //mycode //not working it is showing pwd in db and why is it??
  //   username, email, fullName
  // } = req.body);  
  const {username, email, fullName}=req.body; //yts code
  const userData=new userModel({username, email, fullName});
  
  userModel.register(userData,req.body.password)
  .then(function(){//registereduser
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
})
// login post route
router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true //when it fails,it shows flash msgs
}) ,function(req,res){
})
// logout route
router.get("/logout",function(req,res,next){
  req.logOut(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})
// isLoggedIn function
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
