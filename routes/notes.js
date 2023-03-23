const express=require('express');
const router=express.Router();

const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");


// Route 1: get all Notes using GET "/api/notes/fetchallnotes".login required
router.get('/fetchallnotes',fetchuser, async(req,res)=>{
    try {
        const notes= await Notes.find({user:req.user.id})
        res.json(notes);
    } catch (error) {
        console.log(error.message);
      res.status(500).send("internal server error");
    }
   
})

// Route 2:Add a  new note using post "/api/notes/addnote.login required 

router.post('/addnote',fetchuser, [
    body("title","enter a valid title").isLength({min:3}),
    body("description","enter a valid description").isLength({ min: 5 }),
    body("tag","enter a valid tag").isLength({ min: 3 }),
  ], async(req,res)=>{
    try {
        const {title,description,tag}=req.body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
       const note=new Notes({
        title,description,tag,user:req.user.id
       })
       const savedNote=await note.save();
       res.json(savedNote)
    } catch (error) {
        console.log(error.message);
      res.status(500).send("internal server error");
    }
   
})
// Route 3:update a existing note  new note using put "/api/notes/updatenote.login required 
router.put('/updatenote/:id',fetchuser, [
    body("title","enter a valid title").isLength({min:3}),
    body("description","enter a valid description").isLength({ min: 5 }),
    body("tag","enter a valid tag").isLength({ min: 3 }),
  ], async(req,res)=>{
    try {
        const {title,description,tag}=req.body
        const newNote={};
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag}
        let note= await Notes.findById(req.params.id);
        if(!note){
            res.status(404).send("not found")
        }
        if(note.id.toString()!= req.params.id){
            return res.status(401).send("not allowed")
        }
        note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json(note)
    } catch  (error) {
        console.log(error.message);
      res.status(500).send("internal server error");
        
    }
   
  });

// Route 3:deleting a existing note  new note using put "/api/notes/updatenote.login required 

router.delete('/deletenote/:id',fetchuser, async(req,res)=>{
  try {
      // const {title,description,tag}=req.body

      let note= await Notes.findById(req.params.id);
      if(!note){
          res.status(404).send("not found")
      }
      if(note.id.toString()!= req.params.id){
          return res.status(401).send("not allowed")
      }
      note=await Notes.findByIdAndDelete(req.params.id)
      res.json({"sucess":"note has been deleted"})
  } catch  (error) {
      console.log(error.message);
    res.status(500).send("internal server error");
      
  }
 
});

module.exports=router