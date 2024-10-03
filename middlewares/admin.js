const jwt = require("jsonwebtoken");
const { JWT_SECRET_ADMIN } = require("../config");

function adminMiddleware(req,res,next) {
    const { token } = req.headers;
    const tokenVerification = jwt.verify(token,JWT_SECRET_ADMIN);
    
    if(tokenVerification) {
        req.userId = tokenVerification;
        next();
    } else {
        res.json({
            message : "you are nnot signed in :("
        })
        return;
    }
}

module.exports = {
    adminMiddleware
}
