require('dotenv').config();
const modelUser= require('../model/modelUsers')
const {OAuth2Client} = require('google-auth-library')
const client_id = process.env.CLIENT_ID;
const client = new OAuth2Client(client_id);
const createToken = require('../helps/token')
const verifyToken=async(token)=>{
    const ticket = await client.verifyIdToken({
        idToken:token,
        audience:client_id,
    });
    const payload = ticket.getPayload();
    return payload;
}
const LoginGoogle=async(req,res)=>{
    try {
        const {token}= req.body;
        const payload= await verifyToken(token)
        const {email,name,sub} = payload;
        const accout = await modelUser.findOne({googleId:sub});
        const accessToken = await createToken({email,name},'15m','accessToken')
        if(!accout){
            await modelUser.create({
                name:name,
                phone:"",
                gender:"",
                password:"",
                googleId:sub,
                email:email
            })
        }
        return res.status(200).json({
            message:"success",
            accessToken
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports = LoginGoogle