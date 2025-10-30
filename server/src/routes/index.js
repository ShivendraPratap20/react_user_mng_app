const Express = require("express");
const router = Express.Router();
const validation = require("../middleware/validation");
const upload = require("../middleware/multer");
const { loginValidation, registerValidation } = require("../util/validator");
const { verify, login, signup, modify, remove, logout } = require("../controller/userCtrl");

router.get("/auth", verify);
router.post("/signin", loginValidation, validation, login);
router.post("/register", registerValidation, validation, signup);
router.put("/updateData", upload.single("profilePic"), modify);
router.delete("/deleteData/:userID", remove);
router.get("/logout", logout);

module.exports = router;