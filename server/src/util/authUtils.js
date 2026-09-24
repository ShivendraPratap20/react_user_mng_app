const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_EXPIRY = new Date(Date.now() + 30 * 60 * 1000);
const REFRESH_TOKEN_EXPIRY = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

async function generateAccessToken({ userID }){
    try {
        const token = await jwt.sign({ userID }, process.env.SECRET_KEY)
        if(!token) throw new Error('No access token!')
        return token;
    } catch (error) {
        console.log(`Error occured while generating access token ${error}`)
    }
}

async function generateRefreshToken({ _id }){
    try {
        const token = await jwt.sign({ _id }, process.env.SECRET_KEY);
        if(!token) throw new Error('No refresh token generated!');
        return token;
    } catch (error) {
        console.log(`Error occured while generating refresh token ${token}`)
    }
}

function verifyToken(token){
    try {
        const tokenData = jwt.verify(token, process.env.SECRET_KEY);
        if(!tokenData)
            throw new Error('No data for token')
        return { isValid: true, data: tokenData }
    } catch (error) {
        console.log(`Error in verifying token ${error}`);
        return { isValid: false };
    }
}

async function reGenerateAccessToken({ refreshToken }){}

module.exports = {
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    generateAccessToken,
    generateRefreshToken,
    verifyToken
}