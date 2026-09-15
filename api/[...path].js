const app = require("../server/server");

module.exports = (req, res) => {
  console.log("Vercel API request:", req.method, req.url);

  return app(req, res);
};