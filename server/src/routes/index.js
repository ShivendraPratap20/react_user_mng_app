const Express = require("express");
const router = Express.Router();
const validation = require("../middleware/validation");
const upload = require("../middleware/multer");
const { loginValidation, registerValidation } = require("../util/validator");
const { verify, login, signup, modify, remove, logout, googleLoginHandler, googleCallbackHandler } = require("../controller/userCtrl");
const { signUp2, verifuOTP, resendOTP } = require("../controller/otpCtrl");

router.get("/auth", verify);
router.post("/signin", loginValidation, validation, login);
router.post("/register", registerValidation, validation, signup);
router.put("/updateData", upload.single("profilePic"), modify);
router.delete("/deleteData/:userID", remove);
router.get("/logout", logout);
router.get("/googleSignIn", googleLoginHandler);
router.get("/auth/google/callback", googleCallbackHandler);
router.post("/otp/test", loginValidation, validation, signUp2);
router.post("/otp/verify", verifuOTP);
router.post("/otp/resend", resendOTP)

module.exports = router;