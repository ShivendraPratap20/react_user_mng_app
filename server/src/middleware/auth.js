const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const userModel = require("../db/model/userModel");
const sessionModel = require("../db/model/sessionModel")
const { generateAccessToken, ACCESS_TOKEN_EXPIRY, verifyToken } = require("../util/authUtils")



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



const authV2 = async (req, res, next) => {
    req.authorize=false;
    req.userData = null;
    
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if(!accessToken && !refreshToken){
            console.log(`No tokens found`);
            return next();
        }
        if(accessToken){
            const tokenVerificationResult = verifyToken(accessToken, "access");

            if(tokenVerificationResult.isValid){
                const { data } = tokenVerificationResult;
                const sessionData = await sessionModel.findOne({ userID: data.userID, accessToken });
                if(sessionData && sessionData.accessToken == accessToken && ( Date.now() - new Date(sessionData.accessTokenExpiresAt) < 0 )){
                    const userData = await userModel.findOne({ userID: sessionData.userID }, {password: 0});
                    if(!userData){
                        return next();
                    }
                    req.authorize= true;
                    req.userData= userData;
                    console.log('Access token verification successfull');
                    return next();
                }
            }else{
                console.log(`Access token expired!`)
            }
        }

        if(refreshToken){
            const tokenVerificationResult = verifyToken(refreshToken, "refresh");

            if(!(tokenVerificationResult.isValid))
                return next();

            console.log(`Refresh token verification result ${tokenVerificationResult}`)

            const { data } = tokenVerificationResult;
            const sessionData = await sessionModel.findOne({ _id: data._id });

            if(!sessionData)
                return next();

            const isTokenMatched = await bcrypt.compare(refreshToken, sessionData.refreshToken);
            if(!isTokenMatched || ( new Date(sessionData.refreshTokenExpiresAt) - Date.now() < 0 )){
                res.clearCookie("accessToken"); res.clearCookie("refreshToken");
                return next();
            }

            const accessToken = await generateAccessToken({userID: sessionData.userID});
            await sessionModel.findOneAndUpdate({_id: sessionData._id, userID: sessionData.userID, refreshToken: sessionData.refreshToken}, { 
                accessToken, 
                accessTokenCreatedAt: new Date(),
                accessTokenExpiresAt: new Date(Date.now() + 30 * 60 * 1000) 
            });
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENVIRONMENT == 'PROD'? true: false,
                sameSite: "lax",
                maxAge: ACCESS_TOKEN_EXPIRY,
            });

            const userData = await userModel.findOne({ userID: sessionData.userID }, { password: 0});
            req.authorize= true;
            req.userData= userData;
            console.log('Refresh token created')
            return next();
        }
        next();
    } catch (error) {
        console.log(`Error occur in AuthV2 ${error}`);
        next();
    }
}

module.exports = {
    auth,
    authV2
};