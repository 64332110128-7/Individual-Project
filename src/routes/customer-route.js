const express = require("express");
const customerController = require("../controllers/customer-controller");

const router = express.Router();

router.get("/userAddress/:userId", customerController.getAddressByUserId);
router.post("/address", customerController.createAddress);
router.get("/allAddress", customerController.getAddressLanding);
router.patch("/address/:Id", customerController.updateAddress);
router.delete("/address/:Id", customerController.deleteAddress);
router.get("/address/:Id", customerController.getAddressById);

module.exports = router;
