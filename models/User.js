const mongoose=require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({

  name:{
    type:String,
 
  },
  email:{
    type:String,
    unique:true
    
  },
  password:{
    type:String,
    
  },
  date:{
    type:String,
   
  },

  }, {timestamps: true });
 const User=mongoose.model('user',UserSchema);
//  User.createIndexes();
module.exports=User;