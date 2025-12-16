if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port = process.env.PORT || 8080;
const Listing = require("./models/listing.js");
const path=require("path");
const methodoverride=require("method-override");
const ejsMate=require('ejs-mate');
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const{listingSchema , reviewSchema}=require("./schema.js")
const Review = require("./models/review.js");
const session=require("express-session");
const MongoStore = require("connect-mongo").default;
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const user=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;

///mongoose connection start
main().then((res)=>{
    console.log("database is connected")

})
.catch((err)=>{
console.log("there is an error")
})

 async function main(){
     await mongoose.connect(dbUrl);
 }

 //mongoose connection end
  app.set("view engine" , "ejs");
 app.set("views" , path.join(__dirname , "views"));
 app.use(express.urlencoded({extended:true}));
 app.use(methodoverride("_method"));
 app.engine('ejs' , ejsMate);
 app.use(express.static(path.join(__dirname , "/public")));


// const MongoStore = require("connect-mongo");

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});


store.on("error", (err) => {
  console.log("ERROR ON MONGO SESSION STORE:", err);
});



 const sessionOptions={
  store,
  secret: process.env.SECRET,
  resave:false,
saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};




 app.use(session(sessionOptions));
 app.use(flash());

 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(user.authenticate()));

 passport.serializeUser(user.serializeUser());
 passport.deserializeUser(user.deserializeUser());

 
 app.use((req , res , next)=>{
  res.locals.success= req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.currUser=req.user;
  next();
})


  // app.get("/demouser", async(req , res)=>{
  //   let fakeUser= new user({
  //     email:"student@gmail.com",
  //     username:"Ghouse"
  //   });;
  //    let registeredUser= await user.register(fakeUser , "helloworld");
  //    res.send(registeredUser);
  // })

 app.use("/listings" , listingRouter)
 app.use("/listings/:id/reviews" , reviewRouter);
 app.use("/"  , userRouter);




  //basic route connections start all below
// app.get("/" , (req , res)=>{
//     res.send("Hi , Iam root")
// })

//  app.get("/testListing" , async (req , res)=>{
//     let sampleListing=new Listing({
//     title:" My New Villa",
//     description: "by the beach",
//     price:1200,
//     location: "calangute , goa",
//      country: "INDIA"
//   })
//   await sampleListing.save();
//   console.log("sample was saved")
//   res.send("successfull testing" );
//  })

app.all('/*splat', (req, res, next) => {

  next(new ExpressError("Page Not Found", 404));

});



app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

