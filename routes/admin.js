const express = require("express")
const router = express.Router()
const admin = require("../controller/controllerAdmin")
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const originalName = file.originalname;
        const extension = originalName.split('.').pop();
        const filename = `${uniqueSuffix}.${extension}`;
        cb(null, filename);
    },
});

const upload = multer({
    storage: storage,
});

router.get('/get/user', admin.GetUsers)
router.get("/get/order", admin.GetOrder)
router.get('/detail/order/:_id', admin.GetDetailOrder)
router.get('/detail/user/:id', admin.DetailUser)
router.post('/create/user', admin.CreateUser)
router.put('/update/order/:_id', upload.fields([{ name: 'img' }]), admin.UpdateOrder)
router.post('/login', admin.Login)
router.post('/update/user', admin.UpdateUser)
router.delete('/delete/user/:id', admin.DeleteUser)

module.exports = router