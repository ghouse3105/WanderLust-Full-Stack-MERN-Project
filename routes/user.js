const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

// Show signup form
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// Handle signup form submission
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser , (err)=>{
      if(err){
        return next(err);
      }
       req.flash("success", "Welcome To WanderLust");
    res.redirect("/listings");
    })
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
});

router.get("/login" , (req , res)=>{
    res.render("users/login.ejs");
})


router.post("/login" ,passport.authenticate('local' , {failureRedirect :'/login' , failureFlash:true}) , async(req , res)=>{
    req.flash( "success" , "welcome to wanderlust , You are logged in!!!");
    res.redirect("/listings");
})

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logout successful");
        res.redirect("/listings");
    });
});


module.exports = router;
