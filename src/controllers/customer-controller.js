const prisma = require("../config/prisma");
const createError = require("../utils/createError");
const {
  createAddressSchema,
  updateAddressSchema,
} = require("../validator/address-validator");

exports.getAddressByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const address = await prisma.Shipping_Address.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    if (address.length === 0) {
      return createError(401, "No address found");
    }

    res.json({ address });
  } catch (err) {
    next(err);
  }
};

exports.createAddress = async (req, res, next) => {
  try {
    const value = await createAddressSchema.validateAsync(req.body);
    const address = await prisma.Shipping_Address.create({
      data: {
        ...value,
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    const newAddress = await prisma.Shipping_Address.findFirst({
      where: {
        id: address.id,
      },
    });

    res.json({ newAddress });
  } catch (err) {
    next(err);
  }
};

exports.getAddressLanding = async (req, res, next) => {
  try {
    const address = await prisma.Shipping_Address.findMany({});
    if (!address) {
      return createError(404, "Address not found");
    }
    res.json({ address });
  } catch (err) {
    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const { Id } = req.params;
    const value = await updateAddressSchema.validateAsync(req.body);
    const address = await prisma.Shipping_Address.update({
      where: {
        id: Number(Id),
      },
      data: {
        ...value,
      },
    });

    res.json({ address });
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  const { Id } = req.params;
  try {
    const address = await prisma.Shipping_Address.findUnique({
      where: {
        id: Number(Id),
      },
    });

    const deletedProduct = await prisma.Shipping_Address.delete({
      where: {
        id: Number(Id),
      },
    });

    res.json({ msg: "Delete success", result: deletedProduct });
  } catch (err) {
    next(err);
  }
};

exports.getAddressById = async (req, res, next) => {
  try {
    const { Id } = req.params;
    const address = await prisma.Shipping_Address.findUnique({
      where: {
        id: Number(Id),
      },
    });
    if (!address) {
      return createError(404, "Product ID not found");
    }
    if (address === null) {
      return createError(400, "Product ID = " + productId + " have no item");
    }
    res.json({ address });
  } catch (err) {
    next(err);
  }
};

exports.getFavorite = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const fav = await prisma.Favorite.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        favoriteProducts: {
          include: {
            product: {
              include: {
                brand: true,
                collection: true,
                series: true,
                product_img: true,
              },
            },
          },
        },
      },
    });

    if (fav.length === 0) {
      return createError(404, "No favorite items found");
    }

    res.json({ fav });
  } catch (err) {
    next(err);
  }
};

exports.newFavorite = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;

    const existingFavorite = await prisma.Favorite.findFirst({
      where: {
        userId: parseInt(userId),
        favoriteProducts: {
          some: {
            productId: parseInt(productId),
          },
        },
      },
    });

    if (existingFavorite) {
      return createError(400, "Product is already in favorites");
    }

    const newFavorite = await prisma.Favorite.create({
      data: {
        user: {
          connect: {
            id: parseInt(userId),
          },
        },
        favoriteProducts: {
          create: {
            product: {
              connect: {
                id: parseInt(productId),
              },
            },
          },
        },
      },
      include: {
        favoriteProducts: true,
      },
    });

    res.json({ newFavorite });
  } catch (err) {
    next(err);
  }
};

exports.deleteFavorite = async (req, res, next) => {
  try {
    const { favoriteId } = req.params;

    const fav = await prisma.Favorite.findUnique({
      where: {
        id: parseInt(favoriteId),
      },
    });

    if (!fav) {
      return createError(404, "Favorite not found");
    }

    await prisma.Favorite.delete({
      where: {
        id: parseInt(favoriteId),
      },
    });

    res.json({ message: "Favorite deleted successfully" });
  } catch (err) {
    next(err);
  }
};
