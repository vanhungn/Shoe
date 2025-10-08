const express = require("express")
const router = express.Router()
const admin = require("../controller/controllerAdmin")

router.post('/login',admin.Login)
module.exports = router