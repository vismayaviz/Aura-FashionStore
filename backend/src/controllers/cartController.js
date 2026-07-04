import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({
      user: req.user._id
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }

    const existingItem = cart.items.find(
      item =>
        item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1
      });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id
    }).populate("items.product");

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const updateCartItem = async (
  req,
  res
) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id
    });

    const item = cart.items.find(
      item =>
        item.product.toString() === productId
    );

    if (item) {
      item.quantity = quantity;
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const removeCartItem = async (
  req,
  res
) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id
    });

    cart.items = cart.items.filter(
      item =>
        item.product.toString() !==
        req.params.productId
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};