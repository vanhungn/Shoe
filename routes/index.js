var express = require('express');
var router = express.Router();
const LoginGoogle = require('../controller/controllerLogin')
const RefreshToken = require('../middleware/refreshToken')
const VerifyOtp = require('../middleware/verifyotp')
const Check = require('../helps/checkPhoneEmail')
const MoMo = require('../controller/controllerMomo')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/refreshToken', RefreshToken)
router.post('/sendOTP', LoginGoogle.SendOtp)
router.post('/loginGoogle', LoginGoogle.LoginGoogle)
router.post('/login', LoginGoogle.Login)
router.post('/verifyOtp', VerifyOtp)
router.post('/check', Check)
router.post('/sendEmail', LoginGoogle.sendEmail)
router.post('/api/momo/test', MoMo.Momo)
router.post('/api/momo/notify',MoMo.CreateOrder)

module.exports = router;