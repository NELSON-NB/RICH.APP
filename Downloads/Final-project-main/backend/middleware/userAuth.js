import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';  // Ensure correct import

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token, not authorized' });
        }

        const tokenDecode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        if (!tokenDecode?.id) {
            return res.status(401).json({ success: false, message: 'Invalid token, not authorized' });
        }

        // Fetch user from DB, including status
        const user = await User.findById(tokenDecode.id).select('roles deleted deletedAt status');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // ❌ Prevent login if the user is soft-deleted
        if (user.deleted) {
            return res.status(403).json({ success: false, message: 'Your account is scheduled for deletion. Recover it before login.' });
        }

        // ❌ Prevent login if user is inactive
        if (user.status === 'inactive') {
            return res.status(403).json({ success: false, message: 'Your account has been deactivated by an admin.' });
        }

        req.user = { id: user._id, roles: user.roles };
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Token verification failed', error: error.message });
    }
};


export default userAuth;
