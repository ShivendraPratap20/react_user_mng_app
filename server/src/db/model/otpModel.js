const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const otpSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String
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
    otp: {
        type: Number,
    },
    otpCreatedAt: {
        type: Date,
        default: Date.now
    },
    otpExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 60 * 1000)
    },
    regenerateOTPAfter: {
        type: Date,
        default: () => new Date(Date.now() + 60 * 1000)
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTknCreated: {
        type: Date
    },
    passwordResetTknExpiresAt: {
        type: Date
    }
}, {
    timestamps: true
});


otpSchema.pre("save", function (next) {
    if (this.isModified("otp")) {
        this.otp = bcrypt.hash(this.otp.toString(), 10)
    }
    else if(this.isModified("password")) {
        this.password = bcrypt.hash(this.password, 10)
    }
    next();
});

const otpModel = mongoose.model("otp", otpSchema);


module.exports = otpModel;