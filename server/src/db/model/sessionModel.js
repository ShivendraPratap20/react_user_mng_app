const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../../util/authUtils");


const sessionSchema = new mongoose.Schema({
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
    userID: {
        type: String,
        required: true,
    },
    accessTokenCreatedAt: {
        type: Date,
        default: Date.now
    },

    accessTokenExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 60 * 1000)
    },

    refreshTokenCreatedAt: {
        type: Date,
        default: Date.now
    },

    refreshTokenExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
}, {
    timestamps: true
});

sessionSchema.methods.generateToken = async function(){
    try {
        const accessToken = await generateAccessToken(this);
        const refreshToken = await generateRefreshToken({_id: this._id});
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        await this.save()
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(`Errorrrrr ${error}`)
    }
}


const schemaModel = mongoose.model("session", sessionSchema);


module.exports = schemaModel;