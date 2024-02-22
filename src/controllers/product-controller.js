const prisma = require("../config/prisma");
const createError = require("../utils/createError");
const { Product_status } = require("@prisma/client");

exports.getProductsLanding = async (req, res, next) => {
  try {
    const product = await prisma.product.findMany({
      include: {
        brand: true,
        collection: true,
        series: true,
        product_img: true,
      },
    });
    if (!product) {
      return createError(404, "Product not found");
    }
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const product = await prisma.product.findMany({
      include: {
        brand: true,
        collection: true,
        series: true,
        product_img: true,
      },
    });
    if (product.length === 0) {
      return createError(404, "Product not found");
    }
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findFirst({
      where: {
        id: Number(productId),
      },
      include: {
        brand: true,
        collection: true,
        series: true,
        product_img: true,
      },
    });
    if (!product) {
      return createError(404, "Product ID not found");
    }
    if (product === null) {
      return createError(400, "Product ID = " + productId + " have no item");
    }
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

exports.getAllStatus = async (req, res, next) => {
  try {
    res.json({ status_product: Object.values(Product_status) });
  } catch (err) {
    next(err);
  }
};

exports.getAllBrand = async (req, res, next) => {
  try {
    const brands = await prisma.brand.findMany({});
    if (!brands) {
      return createError(404, "Product not found");
    }
    res.json({ brands });
  } catch (err) {
    next(err);
  }
};

exports.getAllCollection = async (req, res, next) => {
  try {
    const collections = await prisma.collection.findMany({});
    if (!collections) {
      return createError(404, "Product not found");
    }
    res.json({ collections });
  } catch (err) {
    next(err);
  }
};

exports.getAllSeries = async (req, res, next) => {
  try {
    const series = await prisma.series.findMany({});
    if (!series) {
      return createError(404, "Product not found");
    }
    res.json({ series });
  } catch (err) {
    next(err);
  }
};
