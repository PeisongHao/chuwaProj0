const express = require("express");
const router = express.Router();

const {
  getCart,
  applyPromoCode,
  clearCart,
  updateCartItem,
} = require("../controllers/cart.js");

const authMiddleware = require("../middlewares/auth.js");

// 定义路由
// 所有在此文件中的路由都会自动以 /api/cart 为前缀

// GET /api/cart -> 获取购物车详情（已整合价格计算功能）
router.get("/", authMiddleware, getCart);

// POST /api/cart/promo -> 应用或移除优惠码
router.post("/promo", authMiddleware, applyPromoCode);

// PUT /api/cart/item -> 更新购物车商品数量
router.put("/item", authMiddleware, updateCartItem);

// DELETE /api/cart/clear -> 清空购物车
router.delete("/clear", authMiddleware, clearCart);

module.exports = router;
