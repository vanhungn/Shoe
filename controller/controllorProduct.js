const modelProduct = require('../model/modelProduct')
const modelProductSales = require('../model/modelProductSalse')
const createProduct = async (req, res) => {
    try {
        const data = req.body;
        if (
            !data.typeOf ||
            !data.nameProduct ||
            !data.price ||
            data.picture.length <= 0 ||
            data.sizeAndStock.length <= 0 ||
            !data.promote,
            !data.sold
        ) {
            return req.status(400).json({
                message: "not is vail"
            })
        }
        const creacte = new modelProduct({
            typeOf: data.typeOf,
            nameProduct: data.nameProduct,
            price: data.price,
            picture: data.picture,
            sizeAndStock: data.sizeAndStock,
            promote: data.promote,
            sold: data.sold
        })
        await creacte.save()
        return res.status(200).json({
            datas: creacte
        })
    } catch (error) {
        console.log(error)
    }

}
const CreateProductSales = async (req, res) => {
    try {
        const { img, title } = req.body;
        if (!img || !title) {
            return req.status(400).json({
                message: "not is vail"
            })
        }
        await modelProductSales.create({ img, title })
        return res.status(200).json({
            message: "success"
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}
const GetProduct = async (req, res) => {
    try {
        const sold =  parseInt(req.query.sold)
        const discount = parseInt(req.query.discount);
        const skipPage = parseInt(req.query.page) || 1;
        const limitPage = parseInt(req.query.limit) || 10;
        const lengthIssue = await modelProductSales.find({})
        const totalPage = Math.ceil(lengthIssue.length / limitPage);
        const sale = discount === 30 ?{ $gte:  discount === 'null'?null : discount ,$lt : 50}: {$gte:  discount === 'null'?null : discount}
        const data = await modelProduct.aggregate([{
            $match: { ...(discount && {promote: sale}),
            ...(sold && {sold: { $gte: sold === 'null'?null : sold }})
        
        },

        },{
                $sort: { createdAt: -1 },
            }, { $skip: (skipPage - 1) * limitPage },
        { $limit: limitPage },])
        return res.status(200).json({
            data,
            totalPage
        })
    } catch (error) {
        return res.status(500).json({ error })
    }
}
const GetProductSale = async (req, res) => {
    try {
        const skipPage = parseInt(req.query.page) || 1;
        const limitPage = parseInt(req.query.limit) || 10;

        const lengthIssue = await modelProductSales.find({})
        const totalPage = Math.ceil(lengthIssue.length / limitPage);
        const data = await modelProductSales.aggregate([{
            $match: {},
        },{
                $sort: { createdAt: -1 },
            }, { $skip: (skipPage - 1) * limitPage },
        { $limit: limitPage },])
        return res.status(200).json({
            data,
            totalPage
        })
    } catch (error) {
        return res.status(500).json({ error })
    }
}
module.exports = { createProduct, CreateProductSales, GetProduct, GetProductSale }