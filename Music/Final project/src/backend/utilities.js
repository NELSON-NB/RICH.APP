import jwt from "jsonwebtoken"

function authentificationToken(req, next) {
    const authHearder = req.headers ["authourization"];
    const token = authHearder && authHearder.split(" ")[1];

    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    });   
        
    
}

module.exports ={
    authentificationToken,
}