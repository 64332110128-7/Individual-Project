const cloudUpload = require("../utils/cloudUpload");
const cloudDelete = require("../utils/cloudDelete");
const prisma = require("../config/prisma");
const createError = require("../utils/createError");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validator/admin-validator");

exports.createProduct = async (req, res, next) => {
  try {
    const value = await createProductSchema.validateAsync(req.body);

    const { brandId, collectionId, seriesId } = req.body;

    const product = await prisma.product.create({
      data: {
        ...value,
        brand: {
          connect: {
            id: Number(brandId),
          },
        },
        collection: {
          connect: {
            id: Number(collectionId),
          },
        },
        series: {
          connect: {
            id: Number(seriesId),
          },
        },
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    const imagesPromiseArray = req.files.map((file) => {
      return cloudUpload(file.path);
    });

    const imgUrlArray = await Promise.all(imagesPromiseArray);

    const productImages = imgUrlArray.map((imgUrl) => {
      return {
        url: imgUrl,
        productId: product.id,
      };
    });

    await prisma.product_img.createMany({
      data: productImages,
    });

    const newProduct = await prisma.product.findFirst({
      where: {
        id: product.id,
      },
      include: {
        product_img: true,
      },
    });

    res.json({ newProduct });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const value = await updateProductSchema.validateAsync(req.body);

    if (value.brandId) {
      const existBrand = await prisma.brand.findUnique({
        where: {
          id: Number(value.brandId),
        },
      });

      if (!existBrand) {
        return createError(400, "Brand is invalid");
      }
    }

    if (value.collectionId) {
      const existCollection = await prisma.brand.findUnique({
        where: {
          id: Number(value.collectionId),
        },
      });

      if (!existCollection) {
        return createError(400, "Collection is invalid");
      }
    }

    if (value.seriesId) {
      const existSeries = await prisma.brand.findUnique({
        where: {
          id: Number(value.seriesId),
        },
      });

      if (!existSeries) {
        return createError(400, "Series is invalid");
      }
    }

    const product = await prisma.product.update({
      where: {
        id: Number(productId),
      },
      data: {
        ...value,
      },
    });

    res.json({ product });
  } catch (err) {
    next(err);
  }
};

exports.createCollection = async (req, res, next) => {
  try {
    const { name } = req.body;
    const collection = await prisma.collection.create({
      data: {
        name,
      },
    });
    res.json({ collection });
  } catch (err) {
    next(err);
  }
};

exports.createBrand = async (req, res, next) => {
  try {
    const { name } = req.body;
    const brand = await prisma.brand.create({
      data: {
        name,
      },
    });
    res.json({ brand });
  } catch (err) {
    next(err);
  }
};

exports.createSeries = async (req, res, next) => {
  try {
    const { name } = req.body;
    const series = await prisma.series.create({
      data: {
        name,
      },
    });
    res.json({ series });
  } catch (err) {
    next(err);
  }
};

exports.createPromotion = async (req, res, next) => {
  try {
    const { name } = req.body;
    const promotion = await prisma.product_Promotion.create({
      data: {
        name,
      },
    });
    res.json({ promotion });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
      include: {
        product_img: true,
      },
    });

    const imageUrls = product.product_img.map((img) => img.url);
    const deleteImagePromises = imageUrls.map(async (url) => {
      await cloudDelete(url);
    });
    await Promise.all(deleteImagePromises);

    await prisma.product_img.deleteMany({
      where: {
        productId: product.id,
      },
    });

    const deletedProduct = await prisma.product.delete({
      where: {
        id: Number(productId),
      },
    });

    res.json({ msg: "Delete success", result: deletedProduct });
  } catch (err) {
    next(err);
  }
};