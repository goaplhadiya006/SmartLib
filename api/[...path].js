const app = require("../server/server");

module.exports = (req, res) => {
  if (!req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
  }

  return app(req, res);
};
