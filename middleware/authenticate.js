const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header (assuming Bearer scheme)
    const authHeader = req.headers.authorization;

    // Check if token exists and has the correct format (Bearer <token>)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or missing token" });
    }

    // Extract the token string (remove 'Bearer ')
    const token = authHeader.split(" ")[1];

    // Verify the token using jwt.verify
    const decoded = jwt.verify(token, process.env.jwtSecret);

    // Attach user data to request object for further use in routes (optional)
    req.user = decoded.user;

    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticate;
