import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const createOrder = async (
  req,
  res
) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id
    }).populate("items.product");

    if (
      !cart ||
      cart.items.length === 0
    ) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    const items = cart.items.map(item => ({
      product: item.product._id,

      title: item.product.title,

      image:
        item.product.images?.[0] || "",

      price: item.product.price,

      quantity: item.quantity
    }));

    const totalAmount = items.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,

      items,

      shippingAddress:
        req.body.shippingAddress,

      totalAmount
    });

    cart.items = [];

    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find({
        user: req.user._id
      }).sort({
        createdAt: -1
      });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getAllOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find()
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1
        });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const updateOrderStatus =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res
          .status(404)
          .json({
            message:
              "Order not found"
          });
      }

      order.status =
        req.body.status;

      await order.save();

      res.json(order);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };