const mongoose=require('mongoose');
const { Schema } = mongoose;
const NoteSchema = new Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },

  title:{
    type:String,
    required:true
  },
  tag:{
    type:String,
    default:"general"
  },
  description:{
    type:String,
    required:true
  },
  date:{
    type:String,
    default:Date.now
  }
  },{timestamps:true});
 const Notes=mongoose.model('notes',NoteSchema);

module.exports=Notes;