const localStrategy = require("passport-local").Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require("../models/Users");
const User = mongoose.model('users');
module.exports = function(passport){
    passport.use(new localStrategy({usernameField:'email'},(email, password, done)=>{
        User.findOne({email:email})
            .then(users =>{
                if (!users) {
                    return done(null, false, {message:'the user email that you inputed does not exist'})
                }
                bcrypt.compare(password, users.password, (err, isMatch)=>{
                    if (err) throw err;
                    if (isMatch) {
                        return done(null,users);
                    } else {
                        return done(null, false, {message:'the password you entered is incorrect'}) 
                    }
                });
            });
        
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

}