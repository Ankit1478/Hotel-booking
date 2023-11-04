 const listing = require("./models/listing")
 const Review = require("./models/review");

module.exports.isLoggedIn = (req,res,next)=>{
  // console.log(req.path,"..",req.originalUrl);
    if (!req.isAuthenticated()){
        // redirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must login to create a listing");
        return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async(req,res,next) =>{
  let { id } = req.params;
    let Listing =await listing.findById(id);
    if(!Listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error","You are not the Owner");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviweAuthor = async(req,res,next) =>{
  let {id, reviewId } = req.params;
    let review =await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
      req.flash("error","You are not the Owner");
      return res.redirect(`/listings/${id}`);
    }
    next();
}