const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {
  getAllProduct,
  getOneProduct,
  createProduct,
  updateProduct,
  removeProduct,
} = require("../controllers/product");
const { updateUserProductList } = require("../controllers/user");
const router = express.Router();

router.get("/", getAllProduct);
router.get("/detail/:id", getOneProduct);
router.post("/", authMiddleware, createProduct, updateUserProductList);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, removeProduct);

module.exports = router;
