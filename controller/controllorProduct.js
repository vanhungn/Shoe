const modelProduct = require('../model/modelProduct')
const createProduct=async(req,res)=>{
    try {
        const data = req.body;
    const creacte = new modelProduct({
        typeOf:data.typeOf,
        nameProduct:data.nameProduct,
        price:data.price,
        picture:data.picture,
        sizeAndStock:data.sizeAndStock,
        promote:data.promote,
        
    })
    await creacte.save()
    return res.status(200).json({
        datas:creacte
    })
    } catch (error) {
        console.log(error)
    }
    
}
module.exports = createProduct