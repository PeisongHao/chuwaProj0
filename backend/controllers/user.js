const User = require("../models/User");

//传入的是user的id，用于用户完成登陆后加载用户信息
const getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params?.id);
    res.status(200).json(user);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = new User(req.body);
    if (!user.username || !user.password) {
      const err = new Error("Please provide all fields");
      err.statusCode = 400;
      next(err);
      return;
    }
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const updateUserPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body?.username });
    if (!user) {
      const err = new Error("Not Found");
      err.statusCode = 404;
      next(err);
      return;
    }
    user.password = req.body.password;
    await user.save();
    res.status(200).json({ message: "Success update User's Password" });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const updateUserProductList = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      const err = new Error("Not Found");
      err.statusCode = 404;
      next(err);
      return;
    }
    user.productList.push(req.productId);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

const updateUserCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      const err = new Error("Not Found");
      err.statusCode = 404;
      next(err);
      return;
    }
    const item = user.cart.find((entry) =>
      entry.product.equals(req.body?.productId)
    );
    if (!item) {
      user.cart.push({ product: req.body?.productId, amount });
    } else {
      item.amount = req.body?.amount;
    }
    user.cart = user.cart = user.cart.filter((entry) => entry.amount > 0);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  getOneUser,
  createUser,
  updateUserPassword,
  updateUserProductList,
  updateUserCart,
};
