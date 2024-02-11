const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const authenticate = require("../middlewares/authenticate");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.getMe);
router.post("/forget-password", authController.forgetPassword);
router.get("/forget-password/:token", authController.verifyForgetPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;