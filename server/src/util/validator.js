const { body } = require("express-validator");

const loginValidation = [
    body("userID")
    .trim()
    .notEmpty().withMessage("Invalid user ID")
    .normalizeEmail()
    .isEmail().withMessage("Invalid user ID"),
    body("password")
    .isLength({min:8}).withMessage("Password incorrect"),
];

const registerValidation = [
    body("userName")
    .trim()
    .notEmpty().withMessage("User Name is required"),
    body("userID")
    .normalizeEmail()
    .notEmpty().withMessage("UserID is required")
    .isEmail().withMessage("UserID email"),
    body("password")
    .isLength({min:8}).withMessage("Password must be of 8 length"),
    body("confirmPassword")
    .custom((value, {req})=>{
        if(value !== req.body.confirmPassword)
            throw new Error("Password and confirm are not matched")
        return true
    })
];

module.exports = {
    loginValidation,
    registerValidation
}