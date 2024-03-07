const express = require("express");
const orderController = require("../controllers/order-controller");

const router = express.Router();

router.get("/:userId", orderController.getOrderByUserId);
router.post("/:userId", orderController.createOrder);

module.exports = router;
