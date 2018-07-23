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
const methodOverride = require('method-override')


mongoose.Promise = global.Promise; 
//connecting to mongoose

//DB config
const db = require('./config/database');
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
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
app.use(methodOverride('_method'))

//handles sessions
app.use(session({
    secret : "secret",
    saveUninitialized : true,
    resave: true
}))
  
//passport
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
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
  app.use(flash());
  // express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//Load the routes
const router = require("./routes/router");
app.use("/",router)
const users = require("./routes/users");
app.use("/users",users)

const port = process.env.PORT || 3000;

app.listen(port, ()=>{

});