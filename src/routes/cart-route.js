const express = require("express");
const cartController = require("../controllers/cart-controller");

const router = express.Router();

router.get("/:userId", cartController.getCartByUserId);
router.post("/:userId/products/:productId", cartController.addProduct);
router.delete("/:userId/products/:productId", cartController.deleteProduct);

module.exports = router;
