const mongoose = require('mongoose')
const schemas = mongoose.Schema
const UseModels = new schemas({
    name:String,
    phone:String,
    gender:String,
    password:String,
    googleId:String,
    email:String
},
    {TimeRanges:true },
    {collection:"users"}   
)
module.exports=mongoose.model('users',UseModels)