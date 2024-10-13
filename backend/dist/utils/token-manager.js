import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
export const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
};
export const verifyToken = async (req, res, next) => {
    const token = req.signedCookies[COOKIE_NAME];
    console.log("Token received:", token); // Log the received token
    if (!token || token.trim() === "") {
        return res.status(401).json({
            message: "Token Not Received",
        });
    }
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("Token verification failed:", err.message); // Log the error
                return res.status(401).json({ message: "Token Expired" });
            }
            res.locals.jwtData = decoded;
            resolve();
            return next();
        });
    });
};
//# sourceMappingURL=token-manager.js.map