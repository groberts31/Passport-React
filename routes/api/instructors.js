const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const Instructor = require("../../models/Instructor");

// *****************************REGISTER ROUTE*****************************
// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/instructorregister", (req, res) => {
  // Form validation
const { errors, isValid } = validateRegisterInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
Instructor.findOne({ email: req.body.email }).then(instructor => {
    if (instructor) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newInstructor = new Instructor({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
// Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newInstructor.password, salt, (err, hash) => {
          if (err) throw err;
          newInstructor.password = hash;
          newInstructor
            .save()
            .then(instructor => res.json(instructor))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// *******************************USER LOGIN************************************
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/instructorlogin", (req, res) => {
  // Form validation
const { errors, isValid } = validateLoginInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
const email = req.body.email;
  const password = req.body.password;
// Find user by email
  Instructor.findOne({ email }).then(instructor => {
    // Check if user exists
    if (!instructor) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
// Check password
    bcrypt.compare(password, instructor.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: instructor.id,
          name: instructor.name
        };
// Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// module.exports = router;