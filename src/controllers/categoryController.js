const { Category, Destination } = require("../models");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name", "description"],
      include: [
        {
          model: Destination,
          attributes: ["id", "name"],
        },
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully.",
      total: categories.length,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data kategori.",
      error: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Nama kategori wajib diisi.",
      });
    }

    const existingCategory = await Category.findOne({
      where: { name },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Kategori dengan nama tersebut sudah ada.",
      });
    }

    const category = await Category.create({
      name,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Category berhasil ditambahkan.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menambahkan category.",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category tidak ditemukan.",
      });
    }

    await category.update({
      name: name ?? category.name,
      description: description ?? category.description,
    });

    return res.status(200).json({
      success: true,
      message: "Category berhasil diperbarui.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui category.",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category tidak ditemukan.",
      });
    }

    const totalDestinations = await Destination.count({
      where: {
        category_id: id,
      },
    });

    if (totalDestinations > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Category tidak dapat dihapus karena masih digunakan oleh destination.",
      });
    }

    await category.destroy();

    return res.status(200).json({
      success: true,
      message: "Category berhasil dihapus.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus category.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};