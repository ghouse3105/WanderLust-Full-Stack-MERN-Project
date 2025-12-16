const express=require('express');
const router=express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const{listingSchema , reviewSchema}=require("../schema.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner }= require("../middleware.js");



 //index route

 router.get("/" , wrapAsync(async ( req , res)=>{
     const allListings= await Listing.find({})
     res.render("./listings/index.ejs"  ,{ allListings})

 }));

 //create route

 router.get("/new", isLoggedIn ,wrapAsync(async (req , res)=>{
    res.render("./listings/new.ejs")
 }))
  router.post("/"  , wrapAsync(async (req , res)=>{
    //let {title , description , image , price , location , country}=req.body;
    listingSchema.validate(req.body);
    let newlisting=new Listing(req.body.listing);
    newlisting.owner = req.user._id;
     await newlisting.save();
     success: req.flash("success" , "New Listing is Created!!")
     res.redirect("/listings");
    console.log(newlisting);
    
    }));
 //show route
 router.get("/:id" ,wrapAsync(async  (req , res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(req.params.id)
  .populate({
    path: "reviews",
    populate: {
      path: "author"    
    }
  })
  .populate("owner");

     if(!listing){
       req.flash("error" , "The Listing You Requested does nor Exits");
        return res.redirect("/listings");
     }
     res.render("./listings/show.ejs" , {listing});

 }))

 //edit route
 router.get("/:id/edit" ,isLoggedIn , isOwner  , wrapAsync(async  (req , res)=>{
    let{id} = req.params;
     const listing =  await  Listing.findById(id);
 if(!listing){
       req.flash("error" , "The Listing You Requested does nor Exits");
        return res.redirect("/listings");
     }
         res.render("./listings/edit.ejs" , {listing});
 }));


 //update route
 router.put("/:id", isLoggedIn , isOwner , wrapAsync(async (req , res)=>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    success: req.flash("success" , "Changes Done")
    res.redirect(`/listings/${id}`)

 }))

 //delete route
 router.delete("/:id", isLoggedIn , isOwner, wrapAsync(async (req , res)=>{
     let{id} = req.params;
      await Listing.findByIdAndDelete(id);
       success: req.flash("success" , "Listing Deleted!!")
     res.redirect("/listings")

 }));

 module.exports=router;
