const mongoose = require('mongoose')
const schemas = mongoose.Schema
const UseModels = new schemas({
    name: String,
    phone: String,
    password: String,
    googleId: String,
    email: String,
    role:String
},
    { timestamps: true },
    { collection: "users" }
)
module.exports = mongoose.model('users', UseModels)