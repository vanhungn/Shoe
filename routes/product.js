const express = require('express')
const router = express.Router();
const product =  require('../controller/controllorProduct')

router.get('/',product.GetProduct)
router.get('/sale',product.GetProductSale)
router.post('/create',product.createProduct)
router.post('/salesCreate',product.CreateProductSales)

module.exports=router;