const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const tokenSchema = new mongoose.Schema({
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
    acsTknCreatedAt: {
    },
    acsTknExpireAt: {

    },
    rfrshTknCreatedAt: {
        
    },
    rfrshTknExpirecAt: {
        
    }
});