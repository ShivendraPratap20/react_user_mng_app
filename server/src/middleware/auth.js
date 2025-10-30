const jwt = require("jsonwebtoken");
const userModel = require("../db/model/userModel");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const userData = await userModel.findOne({ _id: verifyUser._id });
        if (userData != undefined) {
            req.authorize = true;
            req.userData = userData;
        } else {
            req.authorize = false;
        }
        next();
    } catch (error) {
        console.log(`Error occured in auth ${error}`);
        next();
    }
}
module.exports = auth;