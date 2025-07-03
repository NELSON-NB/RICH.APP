const roleAuth = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.user?.roles) {
            return res.status(401).json({ 
                success: false, 
                message: "No roles found" 
            });
        }

        const rolesArray = [...allowedRoles];
        const hasAllowedRole = req.user.roles
            .some(role => rolesArray.includes(role));

        if (!hasAllowedRole) {
            return res.status(403).json({ 
                success: false, 
                message: "You don't have permission to perform this action" 
            });
        }

        next();
    }
}

export default roleAuth; 