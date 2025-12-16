const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You need to be logged in before use");
        return res.redirect("/login");
    }
    next();
};


module.exports.isOwner =  async (req , res , next) =>{
        let{id} = req.params;
 let listing= await Listing.findById(id);
   if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error" , "You arenot the owner of the listing ");
      return res.redirect(`/listings/${id}`);
   }
   next();
}


module.exports.isReviewAuthor =  async (req , res , next) =>{
        let{ id , reviewId} = req.params;
 let review= await Review.findById(reviewId);
   if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error" , "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
   }
   next();
}