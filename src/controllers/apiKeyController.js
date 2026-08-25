const crypto = require("crypto");
const { ApiKey } = require("../models");

const generateApiKey = () => {
  const randomKey = crypto.randomBytes(32).toString("hex");

  return `ntr_live_${randomKey}`;
};

const createApiKey = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Nama API Key wajib diisi.",
      });
    }

    const apiKey = generateApiKey();

    const newApiKey = await ApiKey.create({
      user_id: req.user.id,
      name,
      key: apiKey,
    });

    return res.status(201).json({
      success: true,
      message: "API Key berhasil dibuat.",
      data: newApiKey,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyApiKeys = async (req, res) => {
  try {
    const apiKeys = await ApiKey.findAll({
      where: {
        user_id: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: apiKeys,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteApiKey = async (req, res) => {
  try {
    const { id } = req.params;

    const apiKey = await ApiKey.findOne({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: "API Key tidak ditemukan.",
      });
    }

    await apiKey.destroy();

    return res.status(200).json({
      success: true,
      message: "API Key berhasil dihapus.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createApiKey,
  getMyApiKeys,
  deleteApiKey,
};