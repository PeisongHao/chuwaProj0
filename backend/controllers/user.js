const User = require("../models/User");
const jwt = require("jsonwebtoken");

//传入的是user的id，用于用户完成登陆后加载用户信息
const getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params?.id);
    const payload = {
      user: {
        id: user._id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).json({
      token,
      productList: user.productList,
      cartList: user.cart,
      isAdmin: user.isAdmin,
    });
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
    const useduser = await User.findOne({ username: req.body?.username });
    if (!useduser) {
      const err = new Error("User already exists");
      err.statusCode = 409;
      next(err);
      return;
    }
    await user.save();

    const payload = {
      user: {
        id: user._id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(201).json({
      token,
      productList: user.productList,
      cartList: user.cart,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const updateUserPassword = async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ username: req.body?.username });
    if (!user) {
      const err = new Error("Not Found");
      err.statusCode = 404;
      next(err);
      return;
    }
    user.password = req.body.password;
    await user.save();

    const payload = {
      user: {
        id: user._id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).json({
      token,
      productList: user.productList,
      cartList: user.cart,
      isAdmin: user.isAdmin,
    });
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
    if (!user.isAdmin) {
      const err = new Error(
        "Forbidden: You do not have permission to access this resource"
      );
      err.statusCode = 403;
      next(err);
      return;
    }
    user.productList.push(req.productId);
    await user.save();
    res.status(200).json({
      //token,
      productList: user.productList,
      cartList: user.cart,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

const updateUserCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
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
      user.cart.push({
        product: req.body?.productId,
        amount: req.body?.amount,
      });
    } else {
      item.amount = req.body?.amount;
    }
    user.cart = user.cart = user.cart.filter((entry) => entry.amount > 0);
    await user.save();
    res.status(200).json({
      productList: user.productList,
      cartList: user.cart,
      isAdmin: user.isAdmin,
    });
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
