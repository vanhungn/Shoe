const modelUser = require("../model/modelUsers")
const modelOrder = require("../model/modelOrder")
const bcrypt = require('bcrypt')
const token = require("../helps/token")
const cloudinary = require('cloudinary').v2;

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
const GetUsers = async (req, res) => {

    try {
        const skip = req.query.skip || 1
        const limit = req.query.limit || 10
        const search = req.query.search || ""
        const query = {
            $match: {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } }
                ]
            }

        };
        const data = await modelUser.aggregate([query,
            { $skip: (skip - 1) * limit },
            { $limit: limit },
            { $project: { password: 0 } },
        ])
        const lengthData = await modelUser.aggregate([query])
        const total = Math.ceil(lengthData.length / limit)
        return res.status(200).json({
            data, total

        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}
const CreateUser = async (req, res) => {
    try {
        const { name, phone, password, email, role } = req.body
        if (!name || !phone || !email || !password || !role) {
            return res.status(400).json({
                message: "Information is missing"
            })
        }
        const check = await modelUser.findOne({
            $or: [{ phone }, { email }]
        })
        if (check) {
            return res.status(400).json({
                message: "Phone or email existed"
            })
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPassWord = bcrypt.hashSync(password, salt);
        await modelUser.create({ name, phone, password: hashPassWord, email, role })
        return res.status(200).json({
            message: "success"
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}
const DetailUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Information is missing"
            })
        }
        const detail = await modelUser.findById(id).select("-password")
        return res.status(200).json({
            detail
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}
const DeleteUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Information is missing"
            })
        }
        const issue = await modelUser.findByIdAndDelete({ _id: id });
        if (!issue) {
            return res.status(400).json({
                message: 'Deleting issue failed',
            });
        }
        return res.status(200).json({
            message: "success"
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}
const UpdateUser = async (req, res) => {
    try {
        const { _id } = req.query
        const { name, phone, password, email, role } = req.body
        if (!name || !phone || !email || !password || !role) {
            return res.status(400).json({
                message: "Information is missing"
            })
        }

        const data = await modelUser.findByIdAndUpdate({ _id: _id },
            {
                name, phone, password, email, role
            }, { new: true }
        )
        return res.status(200).json({
            message: "success",
            data
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}

const GetOrder = async (req, res) => {
    try {
        const search = req.query.search || ""
        const skip = req.query.skip || 1
        const limit = req.query.limit || 10
        const querys = {
            $match: {
                $or: [
                    { name: { $regex: search, $options: "i" } }
                ]
            }

        };
        const order = await modelOrder.aggregate([querys,
            { $skip: (skip - 1) * limit },
            { $limit: limit }
        ])

        const lengthData = await modelOrder.aggregate([querys])
        const total = Math.ceil(lengthData.length / limit)
        return res.status(200).json({
            data: order,
            total
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}
const GetDetailOrder = async (req, res) => {
    try {
        const { _id } = req.params
        if (!_id) {
            return res.status(400).json({
                message: "Information is missing"
            })
        }
        const detail = await modelOrder.findById(_id)
        return res.status(200).json({
            detail
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}
const deleteOrder = async (req, res) => {
    try {
        const { _id } = req.params
        if (!_id) {
            return res.status(400).json({
                message: "Information is missing"
            })
        }
        const issue = await modelOrder.findByIdAndDelete({ _id })
        
        return res.status(200).json({
            message: "success"
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}
const UpdateOrder = async (req, res) => {

    try {
        const { _id } = req.params
        const files = req.files;
        const { quantity, color, size, totalPrice, status, address, payment, name } = req.body
        if (!quantity || !color || !size || !totalPrice || !status || !address || !payment || !name) {
            return res.status(400).json({
                message: "Information is missing"
            })
        }
        cloudinary.config({
            cloud_name: 'djybyg1o3',
            api_key: '515998948284271',
            api_secret: '53vkRUxGp4_JXSjQVIFfED6u-tk',
            secure: true,
        });
        const order = await modelOrder.findById(_id)
        if (files.img) {
            const cloudinaryResponse = await cloudinary.uploader.upload(files.img[0].path);
            if (cloudinaryResponse) {
                order.img = cloudinaryResponse.secure_url;
                console.log(cloudinaryResponse.secure_url)
                order.save()
            }
        }
        const update = await modelOrder.findByIdAndUpdate({ _id: _id },
            {
                quantity, color, size, totalPrice, status, address, payment, name
            }, { new: true }
        )
        return res.status(200).json({
            message: "success",
            update
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}
module.exports = {
    Login,
    GetUsers,
    CreateUser,
    DetailUser,
    DeleteUser,
    UpdateUser,
    GetOrder,
    GetDetailOrder,
    deleteOrder,
    UpdateOrder

}