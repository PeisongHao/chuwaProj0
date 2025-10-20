const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => v > 0,
      message: "Price must bigger than zero",
    },
  },
  stock: {
    type: Number,
    require: true,
    validate: {
      validator: (n) => n >= 0,
      message: "Stock must bigger or equal to zero",
    },
  },
  image: {
    type: String,
    require: true,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)[\w.-]+(\.[\w.-]+)+[/#?]?.*$/.test(v);
      },
      message: "Not a invaild URL",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  Owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
