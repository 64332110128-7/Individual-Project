const cloudUpload = require("../utils/cloudUpload");
const prisma = require("../config/prisma");
const createError = require("../utils/createError");
const { createProductSchema } = require("../validator/admin-validator");

exports.createProduct = async (req, res, next) => {
  try {
    // รับค่าเพื่อสร้าง product
    // สร้าง product
    // สร้าง images -> เชื่อมกับ product ที่สร้างขึ้น

    // const {
    //   priceHigh,
    //   minPriceHigh,
    //   detail,
    //   width,
    //   height,
    //   depth,
    //   weight,
    //   brandId,
    //   categoryId,
    // } = req.body;

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

    // const productImages = await prisma.product_Img.createMany({
    //   data: [{productId, url: imgUrl}],
    // });

    res.json({ newProduct });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    res.json({ message: "Update Product" });
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
