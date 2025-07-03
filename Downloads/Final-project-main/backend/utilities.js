import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    try {
        console.log("Authorization Header:", req.headers.authorization); // Debugging
        const authHeaders = req.headers['authorization'];
        const token = authHeaders && authHeaders.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                error: true, 
                message: "Unauthorized: No token provided" 
            });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ 
                    error: true, 
                    message: "Unauthorized: Token invalid" 
                });
            }

            console.log("Decoded JWT:", decoded); // Debugging the decoded JWT

            // Ensure the user information is extracted correctly
            req.user = decoded; // Assuming the whole decoded object contains user info

            if (!req.user?.id) {
                return res.status(401).json({ error: true, message: "Unauthorized: User ID is missing" });
            }

            console.log("Extracted User from Token:", req.user); // Debugging
            next();
        });

    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
};

export const getStartDateByTimeRange = (timeRange) => {
    const currentDate = new Date();
    
    switch (timeRange) {
        case 'week':
            return new Date(currentDate.setDate(currentDate.getDate() - 7));
        case 'month':
            return new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        case 'year':
            return new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
        default:
            return new Date(0); // No filter, fetch all events
    }
}
