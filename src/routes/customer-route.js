const express = require("express");
const customerController = require("../controllers/customer-controller");

const router = express.Router();

router.get("/userAddress/:userId", customerController.getAddressByUserId);
router.post("/address", customerController.createAddress);
router.get("/allAddress", customerController.getAddressLanding);
router.patch("/address/:Id", customerController.updateAddress);
router.delete("/address/:Id", customerController.deleteAddress);
router.get("/address/:Id", customerController.getAddressById);
router.get("/myFavorite/:userId", customerController.getFavorite);
router.post("/favorite/:userId/:productId", customerController.newFavorite);
router.delete("/favorite/:favoriteId", customerController.deleteFavorite);

module.exports = router;
