const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_EXPIRY = new Date(Date.now() + 30 * 60 * 1000);
const REFRESH_TOKEN_EXPIRY = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

async function generateAccessToken({ userID }){
    try {
        const token = jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: 30*60
        })
        if(!token) throw new Error('No access token!')
        return token;
    } catch (error) {
        console.log(`Error occured while generating access token ${error}`)
    }
}

async function generateRefreshToken({ _id }){
    try {
        const token = jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: 30*60
        });
        if(!token) throw new Error('No refresh token generated!');
        return token;
    } catch (error) {
        console.log(`Error occured while generating refresh token ${error}`)
    }
}

function verifyToken(token, tokenType){
    try {
        const tokenSecretKey = tokenType == "access"? process.env.ACCESS_TOKEN_SECRET_KEY 
        :(tokenType == "refresh")? process.env.REFRESH_TOKEN_SECRET_KEY : null;
         
        const tokenData = jwt.verify(token, tokenSecretKey);
        if(!tokenData)
            throw new Error('No data for token')
        return { isValid: true, data: tokenData }
    } catch (error) {
        console.log(`Error in verifying token ${error}`);
        return { isValid: false };
    }
}

module.exports = {
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    generateAccessToken,
    generateRefreshToken,
    verifyToken
}