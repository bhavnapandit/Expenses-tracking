import jwt from "jsonwebtoken";
export const protect = (req, res, next) => {
    try {
        // Get the authorization header from the request
        const authHeader = req.headers.authorization;

        // Check if the authorization header is missing or doesn't start with "Bearer "
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // Extract the token from the authorization header
        const token = authHeader.split(" ")[1];

        // Verify the token using the JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded;
        
        // Continue to the next middleware function
        next();
    } catch (error) {
        // Log the error and return a 401 response if token verification fails
        console.error(error);
        res.status(401).json({ message: "Token failed" });
    }
};
