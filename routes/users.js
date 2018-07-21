const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("../models/Users");
const Users = mongoose.model("users");


// Add login  route
router.get("/login",(req, res)=>{
    res.render("users/login");
});
// Add register route
router.get("/register",(req, res)=>{
    res.render("users/register");
});
router.post("/register", (req, res)=>{
    var errors = [];
    if(req.body.password!=req.body.password2){
        errors.push({text:"the passwords must match"})
    }
    if (req.body.password.length < 6) {
        errors.push({text:"the password must be at least 6 characters"})
    }
    if (errors.length>0) {
        res.render("users/register",{
            errors:errors,
            name: req.body.name,
            email:req.body.email,
            password: req.body.password,
            password2 : req.body.password2
        });
    }else{
        Users.findOne({email: req.body.email})
            .then(users  => {
                if (users) {
                    req.flash('error_msg', 'The email is already in use');
                    res.redirect("/users/login")
                } else {
                    var newUser = new Users({
                        name: req.body.name,
                        email:req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, (errors, salt)=>{
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then( users =>{
                                    req.flash('success_msg', "You can now login successfully");
                                    res.redirect('/users/login');
                                })
                                .catch(err =>{
                                    console.log("error");
                                    return;
                                });
                        });
                    });
                }
            })

    }
});
module.exports = router;