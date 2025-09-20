var express = require('express');
var router = express.Router();
const LoginGoogle = require('../controller/controllerLogin')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/loginGoogle',LoginGoogle)
module.exports = router;
