const express = require("express");
const bodyParser = require("body-parser");
const session =require("express-session");
const passport =require("passport");
const path = require("path");
const localStrategy = require("passport-local").Strategy;
const multer =require("multer");
const flash =require("connect-flash");
const mongodb =require("mongodb");
const mongoose =require("mongoose");
const expressValidator =require("express-validator");
mongoose.Promise = global.Promise; 
//connecting to mongoose
mongoose.connect("mongodb://localhost:27017/vnode-app", { useNewUrlParser: true })
.then(()=>{
  console.log("MongoDb Connected")
})
.catch(err =>{
  console.log(err)
})
const app = express();
const expressHandleBars = require("express-handlebars");

app.engine('handlebars', expressHandleBars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const uploads = multer({dest:"./images"});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

//handles sessions
app.use(session({
    secret : "secret",
    saveUninitialized : true,
    resave: true
}))
//passport
app.use(passport.initialize());
app.use(passport.session());
//Validators
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));
  // express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
  
app.get("/",(req, res)=>{
    res.render("index");
});

app.listen(3000, ()=>{

});