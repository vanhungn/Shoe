const axios = require('axios');
const crypto = require('crypto');

const Momo = async (req, res) => {
     try {
        const accessKey = "F8BBA842ECF85";
        const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        const orderInfo = "pay with MoMo";
        const partnerCode = "MOMO";
        const redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
        const ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
        const requestType = "payWithMethod";
        const amount = "50000";
        const orderId = partnerCode + new Date().getTime();
        const requestId = orderId;
        const extraData = "";
        const autoCapture = true;
        const lang = "vi";

        // raw signature
        const rawSignature =
            `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}` +
            `&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}` +
            `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

        // signature
        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        // body gửi MoMo
        const requestBody = {
            partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            lang,
            requestType,
            autoCapture,
            extraData,
            signature,
        };

        // gọi API MoMo
        const response = await axios.post(
            "https://test-payment.momo.vn/v2/gateway/api/create",
            requestBody,
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        console.log("MoMo response:", response.data);

        // trả dữ liệu thật cho Postman
        return res.status(200).json(response.data);

    } catch (error) {
        console.error("MoMo error:", error.message, error.response?.data);
        return res.status(500).json({
            error: error.message,
            details: error.response?.data,
        });
    }
};

module.exports = Momo;
