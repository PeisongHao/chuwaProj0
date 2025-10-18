const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {
  getAllProduct,
  getOneProduct,
  createProduct,
  updateProduct,
} = require("../controllers/product");
const { updateUserProductList } = require("../controllers/user");
const router = express.Router();

router.get("/", getAllProduct);
router.get("/:id", getOneProduct);
router.post("/", authMiddleware, createProduct, updateUserProductList);
router.put("/:id", authMiddleware, updateProduct);

module.exports = router;
