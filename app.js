if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoveride = require("method-override"); // to use put opeartion
const ejsMate = require("ejs-mate");
const ExpressErrors = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/User.js");
const MongoStore = require('connect-mongo');


const Listing = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userrouter = require("./routes/users.js");
const { error } = require("console");

app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodoveride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then((res) => {
    console.log("Connect To DB");
  })
  .catch((err) => console.log(err));

async function main() {
  // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  const dburl = process.env.ATLAS_URL;
  await mongoose.connect(dburl);
}

const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (error) => {
  console.log("error in mongo sessions", error);
});


const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Corrected "expire" to "expires"
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get("/", (req, res) => {
//   res.send("hi i am root");
// });


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// we are implementig pbkdf2 hashing algorithm in our project
// app.get("/demouser",async(req,res)=>{
//     let fakeuser = new User({
//         email : "ankit123@gmail.com",
//         username :"ankit123",
//     });
//    let registeruser = await User.register(fakeuser,"helloworld");
//    res.send(registeruser);
// })

app.use("/listings", Listing);
app.use("/listings/:id/reviews", reviews);
app.use("/", userrouter);

app.all("*", (req, res, next) => {
  next(new ExpressErrors(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  // res.status(statusCode).send(message);
  res.render("listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server start 8080");
});
