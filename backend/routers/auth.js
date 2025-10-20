const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

//使用的是jwt模式
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });

    if (!user) {
      const err = new Error("Not Found");
      err.statusCode = 404;
      next(err);
      return;
    }
    if (user.password !== password) {
      const err = new Error("Invalid Credentials");
      err.statusCode = 400;
      next(err);
      return;
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({token,productList : user.productList, cartList : user.cart, isAdmin : user.isAdmin});
  } catch (err) {
    next(err);
  }
});

module.exports = router;