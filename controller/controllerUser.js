const modelUsers = require('../model/modelUsers')
const bcrypt = require('bcrypt')
const CreateUser=async(req,res)=>{
    try {
        const {name,phone,email,password}= req.body
        const checkPhoneEndEmail = await modelUsers.findOne({$or: [{ phone }, { email }]})
        if(checkPhoneEndEmail){
           return res.status(300).json({
                message:"Phone or email incorrect"
            })
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPassWord = bcrypt.hashSync(password, salt);
            await modelUsers.create({name,phone,email,password:hashPassWord})
        return res.status(200).json({
            message:"success"
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}
module.exports = {
    CreateUser
}