const modelOrder = require('../model/modelOrder')
const CreateOrder = async (req, res) => {
    try {
        const order = req.body

        if (!order || order.length < 0) {
            return res.status(400).json({
                message: "invite"
            })
        }
        await modelOrder.insertMany(order.map(element => ({
            idUser: element.idUser,
            quantity: element.quantity,
            color: element.color,
            size: element.size,
            img: element.img,
            totalPrice: element.totalPrice,
            status: element.status,
            address: element.address,
        })));
        return res.status(200).json({
            message: "Success"
        })
    } catch (error) {
        return res.status(500).json({ error })
    }
}
module.exports = { CreateOrder }