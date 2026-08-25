const { ApiUsage, ApiKey } = require("../models");

const getApiUsage = async (req, res) => {
  try {
    const usage = await ApiUsage.findAll({
      include: [
        {
          model: ApiKey,
          attributes: ["id", "name"],
        },
      ],
      order: [["requested_at", "DESC"]],
      limit: 100,
    });

    return res.status(200).json({
      success: true,
      total: usage.length,
      data: usage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil API usage.",
      error: error.message,
    });
  }
};

module.exports = {
  getApiUsage,
};