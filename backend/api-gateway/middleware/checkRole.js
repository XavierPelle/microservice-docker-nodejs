const checkRole = (requiredRoles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            if (!requiredRoles.includes(payload.role)) {
                return res.status(403).json({ message: 'Insufficient permissions' });
            }
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
};

module.exports = { checkRole };
