const mongoose = require('mongoose')
const schema = mongoose.Schema;
const modelOrder = new schema({
    idUser:{type:mongoose.Types.ObjectId,ref:"users"},
    quantity:Number,
    color:String,
    size:String,
    img:String,
    totalPrice:Number,
    status:String,
    address:String,
    payment:String,
    name:String
},{timestamps:true},{collection:"orders"})
module.exports = mongoose.model('orders',modelOrder)