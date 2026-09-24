const jwt = require("jsonwebtoken");
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
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        console.log(`Access token ${accessToken}\nRefresh Token ${refreshToken}`)

        req.authorize=false;
        req.userData = null;

        if(!accessToken && !refreshToken){
            console.log(`No tokens found`);
            return next();
        }
        if(accessToken){
            const tokenVerificationResult = verifyToken(accessToken);

            if(tokenVerificationResult.isValid){
                const { data } = tokenVerificationResult;
                const sessionData = await sessionModel.findOne({ userID: data.userID, accessToken });
                console.log(`Session data at access token ${sessionData}`)
                if(sessionData && ( Date.now() - new Date(sessionData.accessTokenExpiresAt) < 0 )){
                    const userData = await userModel.findOne({ userID: sessionData.userID });
                    req.authorize= true;
                    req.userData= userData;
                }else{
                    console.log(`Access token expired!`)
                }

            }
        }

        if(refreshToken){
            const tokenVerificationResult = verifyToken(refreshToken);

            if(!(tokenVerificationResult.isValid))
                return next();

            console.log(`Refresh token verification result ${tokenVerificationResult}`)

            const { data } = tokenVerificationResult;
            const sessionData = await sessionModel.findOne({ _id: data._id });
            console.log(`Session data ${sessionData}`)
            if(!sessionData || ( new Date(sessionData.refreshTokenExpiresAt) - Date.now() < 0 ))
                return next()

            const accessToken = await generateAccessToken({userID: sessionData.userID});
            await sessionModel.findOneAndUpdate({_id: sessionData._id, userID: sessionData.userID, refreshToken: sessionData.refreshToken}, { accessToken });
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                expires: ACCESS_TOKEN_EXPIRY,
            });

            const userData = await userModel.findOne({ userID: sessionData.userID });
            req.authorize= true;
            req.userData= userData;

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