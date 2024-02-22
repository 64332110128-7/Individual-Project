const express = require("express");
const adminController = require("../controllers/admin-controller");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/product",
  upload.array("Images", 10),
  adminController.createProduct
);
router.patch("/product/:productId", adminController.updateProduct);

router.delete("/product/:productId", adminController.deleteProduct);

router.post("/collection", adminController.createCollection);

router.post("/brand", adminController.createBrand);

router.post("/series", adminController.createSeries);

router.post("/promotion", adminController.createPromotion);

module.exports = router;