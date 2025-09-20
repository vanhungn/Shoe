var express = require('express');
var router = express.Router();
const createProduct = require('../controller/controllorProduct')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/',createProduct)
module.exports = router;
