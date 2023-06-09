
const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config()
const uri=process.env.DB_URI;
const connectToMongo=()=>{
  mongoose.connect(uri,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(() => {
    console.log("mongodb connected");
}).catch(() => {
    console.log('failed to connect');
})
}
module.exports=connectToMongo;