exports.isAdmin = (req, res, next) => {
    if (req.user?.role !== "Admin") {
        return res.status(403).json({ message: "Only Admins are allowed to perform this action", status: false });
    }
    next();
};
