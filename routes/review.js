const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const{reviewSchema}=require("../schema.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn ,isReviewAuthor } = require('../middleware.js');




 //review 
 //review post route
router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review added!");
    res.redirect(`/listings/${listing._id}`);
}));


//delete  review route
router.delete("/:reviewId" , isLoggedIn, isReviewAuthor ,wrapAsync(async(req , res)=>{

    let{id , reviewId}=req.params;
    await Listing.findByIdAndUpdate(id , {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
     success: req.flash("success" , "Review DEleted!")
    res.redirect(`/listings/${id}`);
}))

module.exports=router;