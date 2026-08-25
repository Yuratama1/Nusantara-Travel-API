const { ApiKey } = require("../models");

const validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    // Cek apakah API Key dikirim
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "API Key tidak ditemukan.",
      });
    }

    // Cari API Key di database
    const keyData = await ApiKey.findOne({
      where: {
        key: apiKey,
        is_active: true,
      },
    });

    // Jika API Key tidak valid
    if (!keyData) {
      return res.status(401).json({
        success: false,
        message: "API Key tidak valid atau sudah tidak aktif.",
      });
    }

    // Simpan data API Key ke request
    req.apiKey = keyData;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = validateApiKey;