const modelUser = require("../model/modelUsers")
const bcrypt = require('bcrypt')
const token = require("../helps/token")
const Login = async (req, res) => {
    try {
        const { phone, password } = req.body
        if (!phone || !password) {
            return res.status(400).json({
                message: "invite"
            })
        }
        const user = await modelUser.findOne({ phone, role: "admin" })
        if (!user) {
            return res.status(404).json({
                message: 'Phone does not exist',
            });
        }
        const isPassword = await bcrypt.compare(password, user.password)
        if (!isPassword) {
            return res.status(404).json({
                message: 'Wrong password',
            });
        }
        const newToken = await token({ id: user._id }, '15m', 'accessToken')
        const refreshToken = await token({ id: user._id }, '7d', 'refreshToken');
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,  // 🔒 chặn JS truy cập cookie
            secure: true,    // 🔒 chỉ gửi qua HTTPS (khi deploy)
            sameSite: 'strict', // chống CSRF
            path: '/',       // cookie dùng toàn site
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            accessToken: newToken,
        })

    } catch (error) {
        return res.status(500).json(error)
    }
}
module.exports = {Login}