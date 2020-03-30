const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");

// const instructors = require("./routes/api/instructors");
// const students = require("./routes/api/student");


const app = express();
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
// app.use("/api/instructors", instructors);
// app.use("/api/student", students)


// // ******NOTES FOR POSTMAN***********
// //route for instructor register: localhost:5000/api/instructors/instructorregister
// //route for instructor login: localhost:5000/api/instructors/instructorlogin
// //route for student register:  localhost:5000/api/student/studentregister
// //route for student login: localhost:5000/api/student/studentlogin
// // ***********************************

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

