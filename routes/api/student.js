const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const Student = require("../../models/Student");

// *****************************REGISTER ROUTE*****************************
// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/studentregister", (req, res) => {
  // Form validation
const { errors, isValid } = validateRegisterInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
Student.findOne({ email: req.body.email }).then(student => {
    if (student) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newStudent = new Student({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
// Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newStudent.password, salt, (err, hash) => {
          if (err) throw err;
          newStudent.password = hash;
          newStudent
            .save()
            .then(student => res.json(student))
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
router.post("/studentlogin", (req, res) => {
  // Form validation
const { errors, isValid } = validateLoginInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
const email = req.body.email;
  const password = req.body.password;
// Find user by email
  Student.findOne({ email }).then(student => {
    // Check if user exists
    if (!student) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
// Check password
    bcrypt.compare(password, student.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: student.id,
          name: student.name
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