var express = require('express');
var router = express.Router();
const LoginGoogle = require('../controller/controllerLogin')
const RefreshToken = require('../middleware/refreshToken')
const VerifyOtp = require('../middleware/verifyotp')
const Check = require('../helps/checkPhoneEmail')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/refreshToken', RefreshToken)
router.post('/sendOTP', LoginGoogle.SendOtp)
router.post('/loginGoogle', LoginGoogle.LoginGoogle)
router.post('/login', LoginGoogle.Login)
router.post('/verifyOtp', VerifyOtp)
router.post('/check',Check)
router.post('/sendEmail',LoginGoogle.sendEmail)

module.exports = router;