const prisma = require("../config/prisma");
const createError = require("../utils/createError");

exports.createOrder = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userCart = await prisma.cart.findUnique({
      where: {
        userId: parseInt(userId),
      },
      include: {
        cart_products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!userCart) {
      return res.status(404).json({ message: "User's cart not found" });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        order_item: {
          create: userCart.cart_products.map((cartProduct) => ({
            quantity: cartProduct.quantity,
            product: {
              connect: { id: cartProduct.productId },
            },
          })),
        },
      },
      include: {
        order_item: true,
      },
    });

    await prisma.cart_product.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    res.json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    next(err);
  }
};

exports.getOrderByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const orders = await prisma.order.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        order_item: {
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

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.json({ orders });
  } catch (err) {
    next(err);
  }
};
