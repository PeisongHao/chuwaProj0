const express = require('express');
const authMiddleware = require('../middlewares/auth');
const {
    getAllProduct,
    creatProduct,
    updateProduct
} = require('../controllers/product');
const {updateUserProductList} = require('../controllers/user');
const router = express.Router();

router.get('/product',getAllProduct);
router.post('/product',authMiddleware, creatProduct,updateUserProductList);
router.put('/product/:id',authMiddleware, updateProduct);

module.exports = router;