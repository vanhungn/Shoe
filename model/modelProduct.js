const mongoose = require('mongoose')
const Schemas = mongoose.Schema
const ProductSchemas= new Schemas({
    typeOf:String,
    nameProduct:String,
    price:Number,
    picture:[{url:String , color:String}],
    sizeAndStock:[{
        size:String,
        stock:Number,
    }],
    promote:Number,
    desc: String,
},{timestamps:true},{collection:'products'})
module.exports = mongoose.model('products',ProductSchemas)