const modelOrder = require('../model/modelOrder')
const CreateOrder=async(req,res)=>{
    try {
        const {idUser,img,idProduct,quantity,color,size,totalPrice}= req.body
        if(!idUser,!img,!idProduct,!quantity,!color,!size,!totalPrice){
            return res.status(400).json({
                message:"invite"
            })
        }
        const create = await modelOrder.create({
            idUser,idProduct,quantity,color,size,img,totalPrice
        })
        return res.status(200).json({
            create
        })
    } catch (error) {
        return res.status(500).json({error})
    }
}
module.exports = {CreateOrder}