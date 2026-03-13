const xss = require("xss");

const sanitizeObject = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === "string") {
        result[key] = xss(obj[key]);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        result[key] = sanitizeObject(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
};

const sanitizeMiddleware = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

module.exports = sanitizeMiddleware;
