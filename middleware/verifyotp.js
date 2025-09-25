const redisClient = require("../helps/redisClient");

const VerifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    console.log("👉 Request body:", req.body);

    if (!phone || !otp) {
      console.log("❌ Missing phone or otp");
      return res.status(400).json({ message: "Phone or OTP is missing" });
    }

    console.log("🔎 Checking redis for key:", `otp:${phone}`);
    const storedOtp = await redisClient.get(`otp:${phone}`);
    console.log("📦 Stored OTP:", storedOtp);

    if (!storedOtp) {
      console.log("❌ OTP not found");
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (storedOtp !== otp) {
      console.log("❌ OTP mismatch:", storedOtp, otp);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await redisClient.del(`otp:${phone}`);
    console.log("✅ OTP verified, deleted from redis");

    return res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error("🔥 VerifyOtp error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = VerifyOtp;
