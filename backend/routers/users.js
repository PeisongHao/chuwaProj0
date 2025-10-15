const express = require("express");
const {
  getOneUser,
  createUser,
  updateUserPassword,
  updateUserCart,
} = require("../controllers/user");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/:id", authMiddleware, getOneUser);
router.post("/", createUser);
router.put("/updatePassword", updateUserPassword);
router.put("/updateCart", authMiddleware, updateUserCart);

module.exports = router;
