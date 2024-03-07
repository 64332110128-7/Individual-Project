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
      return createError(403, "Please enter your input data");
    }

    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return createError(400, "Invalid input data, please check your fields");
    }

    const isUserExist = await userService.getUserByEmail(email);

    if (isUserExist) {
      return createError(401, "Email already exist");
    }

    if (confirmPassword !== password) {
      return createError(402, "confirm password not match");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userService.createUser(
      firstName,
      lastName,
      phone,
      email,
      hashedPassword
    );

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
      return createError(401, "Email or password is invalid");
    }

    const isUserExist = await userService.getUserByEmail(email);

    if (!isUserExist) {
      return createError(401, "Email or password is invalid");
    }

    const isPasswordMatch = await bcrypt.compare(password, isUserExist.password);

    if (!isPasswordMatch) {
      return createError(401, "Email or password is invalid");
    }

    const token = jwt.sign({ id: isUserExist.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ message: "Login success", token });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  res.json(req.user);
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
