const { ApiUsage } = require("../models");

const usageLogger = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    if (req.apiKey) {
      ApiUsage.create({
        api_key_id: req.apiKey.id,
        endpoint: req.originalUrl,
        method: req.method,
        status_code: res.statusCode,
        requested_at: new Date(),
      }).catch((error) => {
        console.error("Failed to log API usage:", error.message);
      });
    }

    return originalSend.call(this, body);
  };

  next();
};

module.exports = usageLogger;