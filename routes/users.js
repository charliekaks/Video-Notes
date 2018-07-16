const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Add login  route
router.get("/login",(req, res)=>{
    res.render("users/login");
});
// Add register route
router.get("/register",(req, res)=>{
    res.render("users/register");
});
module.exports = router;