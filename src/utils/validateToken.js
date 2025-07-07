const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;

    if (req.query.token) {
        token = req.query.token;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ status: false, message: "Token missing", data: null });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded.user;
        req.token = token;
        next();
    } catch (err) {
        return res.status(401).json({ status: false, message: "Invalid or expired token", data: null });
    }
});

module.exports = validateToken;
