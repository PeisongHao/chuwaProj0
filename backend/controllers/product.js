const Product = require('../models/Product');

const getAllProduct = async (req,res) =>{
    try {
        const products = await Product.find();
        res.status(200).json(products);
    }catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
};

const creatProduct = async (req,res) =>{
    try {
        const product = new Product(req.body);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProduct = async (req,res) => {
    try {
        const product = await Product.findById(req.params?.id);

        product.productName = req.body.productName || product.productName;
        product.description = req.body.description || product.description;
        product.category = req.body.category || product.category;
        product.price = req.body.price || product.price;
        product.stock = req.body.stock || product.stock;
        product.image = req.body.image || product.image;
        await product.save();
        res.json(product);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getAllProduct,
    creatProduct,
    updateProduct
};