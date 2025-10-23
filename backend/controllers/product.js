const Product = require("../models/Product");

const getAllProduct = async (req, res, next) => {
  try {
    let products, page, searchQuery = {};
    
    if (req.query?.page === undefined) {
      page = 1;
    } else {
      page = parseInt(req.query?.page);
    }
    
    // 构建搜索查询
    if (req.query?.search && req.query.search.trim() !== '') {
      const searchTerm = req.query.search.trim();
      
      // 处理空格情况：将空格替换为可选的空白字符匹配
      // 例如 "product 22" 可以匹配 "Product22", "Product 22", "product22" 等
      const flexibleSearchTerm = searchTerm.replace(/\s+/g, '\\s*');
      
      searchQuery = {
        $or: [
          { productName: { $regex: flexibleSearchTerm, $options: 'i' } },
          { description: { $regex: flexibleSearchTerm, $options: 'i' } }
        ]
      };
    }
    
    const limit = 10; // Number of products per page
    const skip = (page - 1) * limit; // Calculate the offset

    let query = Product.find(searchQuery);

    if (req.query?.sort === "fromNew") {
      query = query.sort({ createdAt: -1 });
    } else if (req.query?.sort === "fromLow") {
      query = query.sort({ price: 1 });
    } else if (req.query?.sort === "fromHigh") {
      query = query.sort({ price: -1 });
    } else {
      // 默认按创建时间排序
      query = query.sort({ createdAt: -1 });
    }

    products = await query.skip(skip).limit(limit);
    const count = await Product.countDocuments(searchQuery);
    
    res.status(200).json({ count: count, products: products });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getOneProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params?.id);
    res.set("Access-Control-Allow-Origin", "*");
    res.status(200).json(product);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const oldProduct = await Product.findOne(req.body);
    if (oldProduct) {
      const err = new Error("Product already exists");
      err.statusCode = 409;
      next(err);
      return;
    }
    const product = new Product(req.body);
    product.Owner = req.user.id;
    await product.save();
    req.productId = product._id;
    req.user = product.Owner;
    next();
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params?.id);
    if (!product) {
      const err = new Error("Not Found");
      err.statusCode = 404;
      next(err);
      return;
    }
    if (product.Owner.toString() !== req.user.id) {
      const err = new Error("Do not have permission to update this product");
      err.statusCode = 403;
      next(err);
      return;
    }
    product.productName = req.body.productName || product.productName;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock || product.stock;
    product.image = req.body.image || product.image;
    await product.save();
    res.json(product);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const removeProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params?.id);
    if (!product) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      next(err);
      return;
    }
    if (product.Owner.toString() !== req.user.id) {
      const err = new Error("Do not have permission to delete this product");
      err.statusCode = 403;
      next(err);
      return;
    }
    await Product.findByIdAndDelete(req.params?.id);
    res.status(200).json({ 
      success: true, 
      message: `Product "${product.productName}" deleted successfully`,
      deletedProductId: req.params?.id
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

module.exports = {
  getAllProduct,
  getOneProduct,
  createProduct,
  updateProduct,
  removeProduct,
};
