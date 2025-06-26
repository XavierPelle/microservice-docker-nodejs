const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SECRET_KEY = process.env.JWT_SECRET || 'CODE007_VENDOR';

class JWTUtils {
    
    static generateSalt() {
        return crypto.randomBytes(16).toString('hex');
    }

    static generateToken(payload) {
        return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h', algorithm: 'HS256' });
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (error) {
            console.error('Token verification error:', error);
            return null;
        }
    }

    static createJWT(userId, email) {
        const payload = {
            user_id: userId,
            email: email,
            role: 'vendor',
            sub: userId,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
        };
        return this.generateToken(payload);
    }

    static decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            console.error('Token decode error:', error);
            return null;
        }
    }
}

module.exports = JWTUtils;
