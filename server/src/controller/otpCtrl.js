const crypto = require("crypto");
const { userModel, otpModel } = require("../db/model");
const sendOTP = require("../services/sendMail");

const signUp2 = async (req, res,) => {
    try {
        const { userID, userName, password, confirmPassword, phoneNumber } = req.body;
        const existsData = await userModel.findOne({ userID: userID });
        if (existsData != undefined) {
            res.status(409).json({
                status: "FAILED", message: "User already exixts", error: {
                    code: "USER_ALREADY_EXISTED",
                    details: null
                }
            });
            return;
        }
        const generatedOTP = crypto.randomInt(100000, 999999);
        const existsUserForOtp = await otpModel.findOne({ userID });
        if (existsUserForOtp) {
            return res.status(409).json({
                status: "FAILED", message: "Pending for OTP verification", error: {
                    code: "OTP_VERIFICATION_PENDING",
                    details: null
                }
            });
        } else {
            const userForOtp = new otpModel({
                userID,
                userName,
                password,
                phoneNumber,
                otp: generatedOTP
            });
            await userForOtp.save();
        }
        const isOTPSend = sendOTP({ userID, otp: generatedOTP });
        if (!isOTPSend)
            return res.status(505).json({
                status: "FAILED", message: "Failed to generate OTP", error: {
                    code: "OTP_GENERATION_ERROR",
                    details: null
                }
            });

        res.status(200).json({
            status: "SUCCESS",
            message: "OTP sent successfully"
        })
    } catch (error) {
        console.log(`Error occured while singing up ${error}`);
        res.status(505).json({ statue: "FAILED", message: "Internal server error" });
    }
};


const verifuOTP = async (req, res) => {
    try {
        const { userID, otp } = req.body;
        if (!userID || !otp)
            return res.status(422).json({
                status: "FAILED",
                message: "OTP verification failed",
                error: {
                    code: 'INVALID_PAYLOADS',
                    details: 'Either userID or otp payload missing'
                }
            });

        const userForOtp = await otpModel.findOne({ userID });
        if (!userForOtp)
            return res.status(422).json({
                status: "FAILED",
                message: "OTP verification failed",
                error: {
                    code: 'USER_NOT_EXISTS',
                    details: 'User data is missing or removed'
                }
            });
        const { otp: savedOtp, otpCreatedAt, otpExpiresAt, userID: savedUserID, userName, phoneNumber, password } = userForOtp;
        if (!((Date.now() - new Date(otpExpiresAt)) < 0))
            return res.status(410).json({
                status: "FAILED",
                message: "OTP expired",
                error: {
                    code: 'OTP_EXPIRED',
                    details: 'OTP expired'
                }
            });

        if (savedOtp !== otp)
            return res.status(400).json({
                status: "FAILED",
                message: "OTP verification failed",
                error: {
                    code: 'Wrong OTP',
                    details: 'Entered OTP is wrong'
                }
            });

        const userData = new userModel({
            userID: savedUserID,
            userName,
            phoneNumber,
            password
        });

        const userDataResult = await userData.save();

        await otpModel.findOneAndDelete({ userID });

        return res.status(200).json({
            status: "SUCCESS",
            message: "OTP verified"
        });

    } catch (error) {
        console.log(`[OTP_VERIFICATION_ERROR] ${error}`);
        res.status(505).json({
            status: "FAILED",
            message: "OTP verification failed",
            error: {
                code: 'OTR_ERR_VERIFICATION',
                details: null
            }
        })
    }
};

const resendOTP = async (req, res) => {
    try {
        const { userID, otp } = req.body;
        if (!userID || !otp)
            return res.status(422).json({
                status: "FAILED",
                message: "OTP verification failed",
                error: {
                    code: 'INVALID_PAYLOADS',
                    details: 'Either userID or otp payload missing'
                }
            });

        const userForOtp = await otpModel.findOne({ userID });
        if (!userForOtp)
            return res.status(422).json({
                status: "FAILED",
                message: "OTP verification failed",
                error: {
                    code: 'USER_NOT_EXISTS',
                    details: 'User data is missing or removed'
                }
            });
        const { otp: savedOtp, otpCreatedAt, otpExpiresAt, userID: savedUserID, userName, phoneNumber, password, regenerateOTPAfter } = userForOtp;
        if (!((Date.now() - new Date(regenerateOTPAfter)) > 0))
            return res.status(422).json({
                status: "FAILED",
                message: "OTP resend requested too soon",
                error: {
                    code: 'OTP_COOLDOWN_ACTIVE',
                    details: null
                }
            });
        const generatedOTP = crypto.randomInt(100000, 999999);

        const updateUserForOtp = await otpModel.findOneAndUpdate(
            { userID },
            {
                otp: generatedOTP,
                otpCreatedAt: Date.now(),
                otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
                regenerateOTPAfter: new Date(Date.now() + 1 * 60 * 1000)
            }
        );
        const isOTPSend = sendOTP({ userID, otp: generatedOTP });
        if (!isOTPSend)
            return res.status(505).json({
                status: "FAILED", message: "Failed to generate OTP", error: {
                    code: "OTP_GENERATION_ERROR",
                    details: null
                }
            });

        res.status(200).json({
            status: "SUCCESS",
            message: "OTP sent successfully"
        })


    } catch (error) {
        console.log(`[OTP_RESEND_ERROR] ${error}`);
        return res.status(505).json({
            status: "FAILED",
            message: "Failed to re-generate OTP",
            error: {
                code: 'OTP_REGENERATION_FAILED',
                details: 'OTP regeneration failed'
            }
        });
    }
};

module.exports = {
    signUp2,
    verifuOTP,
    resendOTP
}