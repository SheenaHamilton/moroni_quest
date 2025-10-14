const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: You must be logged in to access this resource.' });
    }
    next();
};

const isAdmin = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: You must be logged in to access this resource.' });
    }
    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
    }
    next();
};

module.exports = {
    isAuthenticated,
    isAdmin
};