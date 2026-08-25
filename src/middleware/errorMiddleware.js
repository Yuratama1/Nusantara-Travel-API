const notFound = (req, res, next) => {
  res.status(404);

  next(
    new Error(
      `Route tidak ditemukan: ${req.originalUrl}`
    )
  );
};

const errorHandler = (
  err,
  req,
  res,
  next
) => {
  const statusCode =
    res.statusCode === 200
      ? 500
      : res.statusCode;

  return res
    .status(statusCode)
    .json({
      success: false,
      message:
        err.message ||
        "Internal server error.",
    });
};

module.exports = {
  notFound,
  errorHandler,
};