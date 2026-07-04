import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },

        title: String,

        image: String,

        price: Number,

        quantity: Number
      }
    ],

    shippingAddress: {
      fullName: String,

      phone: String,

      address: String,

      city: String,

      state: String,

      postalCode: String,

      country: String
    },

    totalAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
      ],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);

export default Order;