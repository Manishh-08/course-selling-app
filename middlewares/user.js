const jwt = require("jsonwebtoken");
const { JWT_SECRET_USER } = require("../config");


function userMiddleware(req,res,next) {
    const { token } = req.headers;
    const tokenVerification = jwt.verify(token,JWT_SECRET_USER);
    
    if(tokenVerification) {
        req.userId = tokenVerification;
        next();
    } else {
        res.status(403).json({ 
            message : "you are not signed in :("
        })
        return;
    }
}

module.exports = {
    userMiddleware
}