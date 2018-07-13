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
mongoose.connect("mongodb://localhost:27017/node-app", { useNewUrlParser: true })
.then(()=>{
  console.log("MongoDb Connected")
})
.catch(err =>{
  console.log(err)
})
require("./models/Note");
const Notes = mongoose.model("notes");

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
  // the index route
app.get("/",(req, res)=>{
    res.render("index");
});
//ideas route
app.get("/ideas",(req, res)=>{
    Notes.find({})
      .sort({date:"desc"})
      .then(notes =>{
        res.render("ideas",{notes:notes})
      });

});
// Add ideas route
app.get("/add",(req, res)=>{
    res.render("add");
});
//Edit idea route
app.get("/edit/:id",(req, res)=>{
  Notes.findOne({
    _id: req.params.id
  }).then(notes =>(res.render("edit",{notes:notes})));

});
//the editing process route
app.put("/edit/:id", (req,res)=>{
  Notes.findOne({
    _id: req.params.id  
  }).then(notes =>{
    notes.title = req.body.title;
    notes.details = req.body.details;
    notes.save()
      .then(notes => {res.redirect("/ideas")})
  })
});
//handling the form to add ideas
app.post("/ideas", (req, res)=>{
  var errors = [];
  if (!req.body.title) {
    errors.push({text: "Please add a Title"})
  }
  if (!req.body.details) {
    errors.push({text: "please add some details to the form"})
  }
  if(errors.length>0){
    res.render("add",{
      errors:errors,
      title: req.body.title,
      details: req.body.details
    });
  }else{
    var newNote ={
      title: req.body.title,
      details: req.body.details
    }
    new Notes(newNote)
      .save()
      .then( notes =>{
        res.redirect("/ideas")
      })
  }
  
});


app.listen(3000, ()=>{

});