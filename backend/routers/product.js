const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {
  getAllProduct,
  creatProduct,
  updateProduct,
} = require("../controllers/product");
const { updateUserProductList } = require("../controllers/user");
const router = express.Router();

router.get("/", getAllProduct);
router.post("/", authMiddleware, creatProduct, updateUserProductList);
router.put("/:id", authMiddleware, updateProduct);

module.exports = router;
