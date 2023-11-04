const User = require("../models/User.js");

module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs");
  }

module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
  }
module.exports.signupUser = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
       const registeredUser=await User.register(newUser, password);
      req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Welcome to wonderLust");
      res.redirect("/listings");
      });
    } catch (err) {
      // Handle any registration errors here
      req.flash("error", err.message);
      res.redirect("/signup"); // Redirect to the signup page again
    }
  }


module.exports.login =async (req, res) => {
    req.flash("success","Welcome Back to WonderLust");
    let redirecUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirecUrl);
   }

module.exports.logOut = (req, res,next) =>{
    req.logOut((err)=>{
      if(err){
        next(err);
      }
      req.flash("success", "You are log out");
      res.redirect("/listings");
    })
  }