const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.cookies;
    console.log(req.user);

    if(!token){
        return res.status(403).send("A token require for authentication");
    }
    
    next();
}

module.exports = verifyToken;