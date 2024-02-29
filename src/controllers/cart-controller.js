const prisma = require("../config/prisma");
const createError = require("../utils/createError");

exports.getCartByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const cart = await prisma.cart.findUnique({
      where: {
        userId: parseInt(userId),
      },
      include: {
        cart_products: {
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
    res.json({ cart });
  } catch (err) {
    next(err);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    const cart = await prisma.cart.findUnique({
      where: {
        userId: parseInt(userId),
      },
    });
    if (!cart) {
      const newCart = await prisma.cart.create({
        data: {
          userId: parseInt(userId),
        },
      });
      await prisma.cart_product.create({
        data: {
          quantity: parseInt(quantity),
          cartId: newCart.id,
          productId: parseInt(productId),
        },
      });
    } else {
      await prisma.cart_product.create({
        data: {
          quantity: parseInt(quantity),
          cartId: cart.id,
          productId: parseInt(productId),
        },
      });
    }
    res.json({ message: "Product added to cart successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    await prisma.cart_product.deleteMany({
      where: {
        cartId: parseInt(userId),
        productId: parseInt(productId),
      },
    });
    res.json({ message: "Product removed from cart successfully" });
  } catch (err) {
    next(err);
  }
};
