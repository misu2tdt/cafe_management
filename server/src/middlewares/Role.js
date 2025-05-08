export const staffOnly = (req, res, next) => {
    if (req.user?.role === "STAFF") {
      return next();
    }
    return res.status(403).json({ message: "Access denied: Staff only" });
  };
  