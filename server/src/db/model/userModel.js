const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    userName: {
        type: String
    },
    userID: {
        type: String,
        required: [true, 'User ID is required'],
        unique: true
    },
    password: {
        type: String,
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function (v) {
                return /[a-zA-Z]/.test(v) && /[0-9]/.test(v);
            },
            message: 'Password must be alphanumeric'
        }
    },
    phoneNumber: {
        type: Number,
        validate: {
            validator: function (v) {
                const phoneStr = v.toString();
                return /^\d{10}$/.test(phoneStr);
            },
            message: 'Phone number must be 10 digits long and contain only numbers'
        }
    }, 
    profilePic: {
        type: String,
        default: "", 
    },
    tokens: [
        {
            token: {
                type: String
            }
        }
    ]
});

userSchema.methods.generateToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        console.log(`Error while generating token ${error}`);
    }
};

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;