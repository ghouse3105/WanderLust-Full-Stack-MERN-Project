const { ref } = require("joi");
const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const Review=require("./review.js")

const listingSchema=new Schema({
    title:{
       type: String,
    required: true
    },
    description:String,
   image: {
  type: String,
  default: "https://images.unsplash.com/photo-1759130087819-db88758c3fab?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  set: (v) => {
    if (v && typeof v === 'object' && v.url) {
      return v.url;
    }
    return v === "" ? "https://images.unsplash.com/photo-1759130087819-db88758c3fab?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v;
  }
},

    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"user"
    }
});


listingSchema.post("findOneAndDelete" , async(listing)=>{
  if(listing){
     await Review.deleteMany({_id:{$in:listing.reviews}})
  }
})

const Listing=mongoose.model("Listing" , listingSchema);
 

module.exports = Listing;
