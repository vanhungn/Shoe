var express = require('express');
var router = express.Router();
const LoginGoogle = require('../controller/controllerLogin')
const RefreshToken = require('../middleware/refreshToken')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/refreshToken',RefreshToken)
router.post('/loginGoogle',LoginGoogle)
module.exports = router;
