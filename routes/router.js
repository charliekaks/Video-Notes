const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
require("../models/Note");
const Notes = mongoose.model("notes");

  // the index route
  router.get("/",(req, res)=>{
    Notes.find({})
      .sort({date:"desc"})
      .then(notes =>{
        res.render("index",{notes:notes})
      });

});
// Add ideas route
router.get("/add",(req, res)=>{
    res.render("add");
});
//Edit idea route
router.get("/edit/:id",(req, res)=>{
  Notes.findOne({
    _id: req.params.id
  }).then(notes =>(res.render("edit",{notes:notes})));

});
//the editing process route
router.put("/edit/:id", (req,res)=>{
  Notes.findOne({
    _id: req.params.id  
  }).then(notes =>{
    notes.title = req.body.title;
    notes.details = req.body.details;
    notes.save()
      .then(notes => {
        req.flash("success_msg","Your notes have been successfully edited")
        res.redirect("/")
      });
  });
});
//the delete process route
router.delete("/edit/:id", (req,res)=>{
  Notes.remove({_id:req.params.id
  }).then(()=>{
    req.flash("success_msg","Video notes were successfully deleted");
    res.redirect("/");
  })
});
//handling the form to add ideas
router.post("/", (req, res)=>{
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
        req.flash("success_msg","Successfully added an Idea")
        res.redirect("/")
      })
  }
  
});


module.exports = router;