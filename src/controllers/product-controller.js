const prisma = require("../config/prisma");
const createError = require("../utils/createError");

exports.getProductsLanding = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    res.json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
  const { brand, collection, series } = req.query;
  const products = await prisma.product.findMany({
    where: {
      brand: {
        name: brand,
      },
      collection: {
        name: collection,
      },
      series: {
        name: series,
      }
    },
    include: {
      brand: true,
      collection: true,
      series: true,
    },
  });
  if(products.length === 0) {
    return createError(404, 'Product not found');
  }
  res.json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!product) {
      return createError(404, "Product ID not found");
    }
    const product = await prisma.product.findFirst({
      where: {
        id: Number(productId),
      },
    });
    if (product === null) {
      return createError(400, "Product ID = " + productId + " have no item");
    }
    res.json({ product });
  } catch (err) {
    next(err);
  }
};
