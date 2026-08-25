const { Op } = require("sequelize");
const { Destination, Category } = require("../models");

const getAllDestinations = async (req, res) => {
  try {
    const {
      search,
      province,
      category,
      min_rating,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    if (
    Number.isNaN(pageNumber) ||
    Number.isNaN(limitNumber) ||
    pageNumber < 1 ||
    limitNumber < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Parameter page dan limit harus berupa angka lebih dari 0.",
      });
    }

    if (limitNumber > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Limit maksimal adalah 100 data per request.",
      });
    }

    const offset = (pageNumber - 1) * limitNumber;

    const whereCondition = {};

    // Search berdasarkan nama, kota, atau provinsi
    if (search) {
      whereCondition[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          city: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          province: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    // Filter province
    if (province) {
      whereCondition.province = {
        [Op.iLike]: `%${province}%`,
      };
    }

    // Filter minimum rating
    if (min_rating) {
      whereCondition.rating = {
        [Op.gte]: min_rating,
      };
    }

    const categoryCondition = {};

    // Filter category berdasarkan nama category
    if (category) {
      categoryCondition.name = {
        [Op.iLike]: `%${category}%`,
      };
    }

    const { count, rows } = await Destination.findAndCountAll({
      where: whereCondition,

      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          where:
            Object.keys(categoryCondition).length > 0
              ? categoryCondition
              : undefined,
          required: Object.keys(categoryCondition).length > 0,
        },
      ],

      limit: limitNumber,
      offset,

      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      success: true,
      message: "Destinations retrieved successfully.",

      pagination: {
        current_page: pageNumber,
        limit: limitNumber,
        total_data: count,
        total_pages: totalPages,
      },

      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data destinasi.",
      error: error.message,
    });
  }
};

const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await Destination.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination tidak ditemukan.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Destination retrieved successfully.",
      data: destination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail destinasi.",
      error: error.message,
    });
  }
};

const createDestination = async (req, res) => {
  try {
    const {
      category_id,
      name,
      description,
      city,
      province,
      address,
      latitude,
      longitude,
      rating,
      review_count,
      ticket_price,
      opening_time,
      closing_time,
      status,
    } = req.body;

    if (!category_id || !name || !description || !city || !province) {
      return res.status(400).json({
        success: false,
        message:
          "category_id, name, description, city, dan province wajib diisi.",
      });
    }

    const category = await Category.findByPk(category_id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category tidak ditemukan.",
      });
    }

    const destination = await Destination.create({
      category_id,
      name,
      description,
      city,
      province,
      address,
      latitude,
      longitude,
      rating,
      review_count,
      ticket_price,
      opening_time,
      closing_time,
      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      message: "Destination berhasil ditambahkan.",
      data: destination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menambahkan destination.",
      error: error.message,
    });
  }
};

const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await Destination.findByPk(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination tidak ditemukan.",
      });
    }

    if (req.body.category_id) {
      const category = await Category.findByPk(req.body.category_id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category tidak ditemukan.",
        });
      }
    }

    await destination.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Destination berhasil diperbarui.",
      data: destination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui destination.",
      error: error.message,
    });
  }
};

const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await Destination.findByPk(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination tidak ditemukan.",
      });
    }

    await destination.destroy();

    return res.status(200).json({
      success: true,
      message: "Destination berhasil dihapus.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus destination.",
      error: error.message,
    });
  }
};

const searchDestinations = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Parameter q wajib diisi.",
      });
    }

    const destinations = await Destination.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${q}%`,
            },
          },
          {
            city: {
              [Op.iLike]: `%${q}%`,
            },
          },
          {
            province: {
              [Op.iLike]: `%${q}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${q}%`,
            },
          },
        ],
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Search destinations berhasil.",
      query: q,
      total: destinations.length,
      data: destinations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal melakukan pencarian destination.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllDestinations,
  getDestinationById,
  searchDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
};