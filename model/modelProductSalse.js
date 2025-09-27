const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ProductSale = new schema({
    img: String,
    title: String
}, { timestamps: true }, { collection: 'product_sales' })
module.exports = mongoose.model('product_sales', ProductSale)
