const Product = require("../models/Product");

const getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getOneProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params?.id);
    res.set("Access-Control-Allow-Origin", "*");
    res.status(200).json(product);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const oldProduct = await Product.findOne(req.body);
    if (oldProduct) {
      const err = new Error("Product already exists");
      err.statusCode = 409;
      next(err);
      return;
    }
    const product = new Product(req.body);
    await product.save();
    req.productId = product._id;
    req.user = product.Owner;
    next();
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params?.id);
    if (!product) {
      const err = new Error("Not Found");
      err.statusCode = 404;
      next(err);
      return;
    }
    if (product.Owner.toString() !== req.user.id) {
      const err = new Error("Do Not have permssion to update");
      err.statusCode = 400;
      next(err);
      return;
    }
    product.productName = req.body.productName || product.productName;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock || product.stock;
    product.image = req.body.image || product.image;
    await product.save();
    res.json(product);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

module.exports = {
  getAllProduct,
  getOneProduct,
  createProduct,
  updateProduct,
};
