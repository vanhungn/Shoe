const express = require('express')
const router = express.Router();
const product =  require('../controller/controllerProduct')

router.get('/',product.GetProduct)
router.get("/detail/:id",product.GetProductDetail)
router.get('/sale',product.GetProductSale)
router.post('/create',product.createProduct)
router.post('/salesCreate',product.CreateProductSales)

module.exports=router;