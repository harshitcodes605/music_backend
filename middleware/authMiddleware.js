import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Get the token from the request header
    const authHeader = req.headers.authorization;

    // Check if token exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to the request object
    req.user = decoded;

    // Move to the next middleware/controller
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
