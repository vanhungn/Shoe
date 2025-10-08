const express = require("express")
const router = express.Router()
const admin = require("../controller/controllerAdmin")

router.get('/get/user', admin.GetUsers)
router.get('/detail/user/:id', admin.DetailUser)
router.post('/create/user', admin.CreateUser)
router.post('/login', admin.Login)
router.delete('/delete/user/:id', admin.DeleteUser)

module.exports = router