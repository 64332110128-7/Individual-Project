const createError = require("../utils/createError");
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const userService = require("../services/user_service");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email, password, confirmPassword } =
      req.body;

    if (
      !(firstName && lastName && phone && email && password && confirmPassword)
    ) {
      return next(new Error("Fulfill all inputs"));
    }

    if (typeof firstName !== "string") {
      return createError(400, "First name is invalid");
    }

    if (typeof lastName !== "string") {
      return createError(400, "Last name is invalid");
    }

    if (typeof email !== "string") {
      return createError(400, "Email is invalid");
    }

    if (typeof password !== "string") {
      return createError(400, "password is invalid");
    }

    if (typeof confirmPassword !== "string") {
      return createError(400, "Confirm Password is invalid");
    }

    const isUserExist = await userService.getUserByEmail(email);

    if (isUserExist) {
      return createError(400, "Email already exist");
    }

    if (confirmPassword !== password) {
      return createError(400, "confirm password not match");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userService.createUser(email, hashedPassword);

    res.json({ message: "register success" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return createError(400, "Email and password are required");
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return createError(400, "Email or password is invalid");
    }

    const isUserExist = await userService.getUserByEmail(email);

    if (!isUserExist) {
      return createError(400, "Email or password is invalid");
    }

    const isPasswordMatch = bcrypt.compare(password, isUserExist.password);

    if (!isPasswordMatch) {
      return createError(400, "Email or password is invalid");
    }

    const token = jwt.sign({ id: isUserExist.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ message: "Login success" });
  } catch (error) {
    next(err);
  }
};

exports.forgetPassword = (req, res, next) => {
  const { email } = req.body;
  // gen token -> สร้าง link -> ส่ง email
  res.json({ email });
};

// https://api.codecamp.com/auth/forget-password/kdjfkdjfkdjkfjd
exports.verifyForgetPassword = (req, res, next) => {
  const { token } = req.params;
  // logic check token
  // redirect reset password -> ติด token
  res.json({ token });
};

exports.resetPassword = (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  // check token
  // เปลี่ยน Password
  // เก็บ password ใหม่ ลง db
  res.json({ token, password });
};
