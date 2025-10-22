const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  productList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      amount: {
        type: Number,
        required: true,
        validate: {
          validator: (v) => v >= 0,
          message: "Amount must be bigger or equal to˝ zero",
        },
      },
    },
  ],
  activePromoCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PromoCode",
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
