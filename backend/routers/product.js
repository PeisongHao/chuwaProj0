const express = require('express');

const {
    getAllProduct,
    creatProduct,
    updateProduct
} = require('../controllers/product');

const router = express.Router();

router.get('/product',getAllProduct);
router.post('/product', creatProduct);
router.put('/product/:id', updateProduct);

module.exports = router;