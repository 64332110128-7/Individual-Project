const express = require("express");
const productController = require("../controllers/product-controller");

const router = express.Router();

router.get("/landing", productController.getProductsLanding);
router.get("/", productController.getProducts);
router.get("/allStatus", productController.getAllStatus);
router.get("/allBrand", productController.getAllBrand);
router.get("/allCollection", productController.getAllCollection);
router.get("/allSeries", productController.getAllSeries);
router.get("/:productId", productController.getProductById);

module.exports = router;
