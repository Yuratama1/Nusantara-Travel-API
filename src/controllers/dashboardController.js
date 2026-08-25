const {
  Destination,
  Category,
  ApiKey,
  ApiUsage,
} = require("../models");

const getDashboardStats = async (req, res) => {
  try {
    const totalDestinations = await Destination.count();
    const totalCategories = await Category.count();
    const totalApiKeys = await ApiKey.count();
    const totalApiRequests = await ApiUsage.count();

    const recentUsage = await ApiUsage.findAll({
      include: [
        {
          model: ApiKey,
          attributes: ["id", "name"],
        },
      ],
      order: [["requested_at", "DESC"]],
      limit: 10,
    });

    return res.status(200).json({
      success: true,
      data: {
        totalDestinations,
        totalCategories,
        totalApiKeys,
        totalApiRequests,
        recentUsage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data dashboard.",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};