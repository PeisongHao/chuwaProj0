const express = require("express");
const router = express.Router();

const {
  getCart,
  applyPromoCode,
  clearCart,
  updateCartItem,
} = require("../controllers/cart.js");

const authMiddleware = require("../middlewares/auth.js");


router.get("/", authMiddleware, getCart);
router.post("/promo", authMiddleware, applyPromoCode);
router.put("/item", authMiddleware, updateCartItem);
router.delete("/clear", authMiddleware, clearCart);

module.exports = router;
