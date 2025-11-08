const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing token" });
  const token = auth.split(" ")[1];
  // allow local-dev-token bypass for development when frontend uses a fake token
  if (token === "local-dev-token") {
    req.user = { id: "local", name: "Dev" };
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
};
