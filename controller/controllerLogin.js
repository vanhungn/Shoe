require('dotenv').config();
const modelUser = require('../model/modelUsers')
const token = require("../helps/token")
const Send = require('../helps/sendOtp')
const { OAuth2Client } = require('google-auth-library')
const bcrypt = require('bcrypt')
const client_id = process.env.CLIENT_ID;
const client = new OAuth2Client(client_id);
const createToken = require('../helps/token');
const ToE164 = require('../helps/transformPhone');
const redisClient = require("../helps/redisClient");
const modelUsers = require('../model/modelUsers');
const transporter = require('../helps/email')
const verifyToken = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: client_id,
    });
    const payload = ticket.getPayload();
    return payload;
}
const LoginGoogle = async (req, res) => {
    try {
        const { token } = req.body;
        const payload = await verifyToken(token)
        const { email, name, sub } = payload;
        const accout = await modelUser.findOne({ googleId: sub });
        const accessToken = await createToken({ email, name }, '15m', 'accessToken')
        const refreshToken = await createToken({ email, name }, '1d', 'refreshToken')
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,  // 🔒 chặn JS truy cập cookie
            secure: true,    // 🔒 chỉ gửi qua HTTPS (khi deploy)
            sameSite: 'strict', // chống CSRF
            path: '/',       // cookie dùng toàn site
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        if (!accout) {
            await modelUser.create({
                name: name,
                phone: "",
                gender: "",
                password: "",
                googleId: sub,
                email: email
            })
        }
        return res.status(200).json({
            message: "success",
            accessToken
        })
    } catch (error) {
        console.log(error)
    }
}
const Login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const users = await modelUser.findOne({ phone })
        if (!users) {
            return res.status(404).json({
                message: 'Phone does not exist',
            });
        }
        const isPassword = await bcrypt.compare(password, users.password)
        if (!isPassword) {
            return res.status(404).json({
                message: 'Wrong password',
            });
        }
        const newToken = await token({ phone }, '15m', 'accessToken')
        return res.status(200).json({
            accessToken: newToken,
            data: { name: users.name }
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}
const SendOtp = async (req, res) => {
    try {
        const { phone, email } = req.body;
        if (!phone || !email) {
            return res.status(400).json({
                message: 'phone or email is not exist'
            })
        }
        const ToE164Phone = await ToE164(phone)
        const otp = Math.floor(1000 + Math.random() * 9000);
        await redisClient.setEx(`otp:${phone}`, 180, otp.toString());
        await Send(ToE164Phone, `Your OTP code is: ${otp}`)
        return res.status(200).json({
            message: 'Send otp success'
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}
const sendEmail = async (req, res) => {
    try {
        const { email } = req.body
        const otp = Math.floor(1000 + Math.random() * 9000);

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It will expire in 3 minutes.`,
        };
        await transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                return res.status(404).json({
                    message: 'Error when sending email',
                });
            }
        })
        await redisClient.setEx(`otp:${email}`, 180, otp.toString());
        return res.status(200).json({
            message: 'Email has been sent',
        });
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}
module.exports = {
    LoginGoogle,
    Login,
    SendOtp,
    sendEmail
}