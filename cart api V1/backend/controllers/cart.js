const mongoose = require('mongoose');
const User = require('../models/User.js');
const Product = require('../models/Product.js');
const PromoCode = require('../models/PromoCode.js');
const CustomAPIError = require('../errors');
const { calculateCartTotal, applyPromoDiscount, formatPrice } = require('../utils/priceCalculator');

/**
 * @param {string} userId
 * @returns {Object} 用户对象（包含populate的购物车和优惠码信息）
 */
const getUserCart = async (userId) => {
  const user = await User.findById(userId).populate([
    { 
      path: 'cart.product', 
      model: 'Product',
      select: '_id productName price image stock category' 
    },
    { 
      path: 'activePromoCode', 
      model: 'PromoCode',
      select: '_id code discountType discountValue minAmount maxDiscount expiryDate isActive usageLimit usedCount' // 只选择需要的字段
    }
  ]);

  if (!user) {
    throw new CustomAPIError('User not found', 404);
  }
  return user;
};

/**
 * @desc    获取用户的购物车详情（
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res, next) => {
  try {
    const user = await getUserCart(req.user.id);
    
    // 检查已应用的优惠码是否过期
    if (user.activePromoCode && (user.activePromoCode.isExpired() || !user.activePromoCode.isUsable())) {
      User.findByIdAndUpdate(user._id, { $unset: { activePromoCode: "" } })
        .catch(err => console.error('Failed to remove expired promo code:', err));
      user.activePromoCode = null;
    }
    
    // 计算基础总价
    const subtotal = calculateCartTotal(user.cart);
    let finalTotal = subtotal;
    let discountInfo = null;

    // 如果有有效的优惠码，计算折扣
    if (user.activePromoCode && subtotal >= user.activePromoCode.minAmount) {
      try {
        const discountResult = applyPromoDiscount(subtotal, user.activePromoCode);
        finalTotal = discountResult.finalAmount;
        discountInfo = {
          code: user.activePromoCode.code,
          type: user.activePromoCode.discountType,
          value: user.activePromoCode.discountValue,
          discountAmount: formatPrice(discountResult.discountAmount),
          freeShipping: discountResult.freeShipping || false
        };
      } catch (error) {
        console.warn('Promo code calculation failed:', error.message);
      }
    }
    
    const cartItems = user.cart.map(item => ({
      product: item.product ? {
        _id: item.product._id,
        productName: item.product.productName,
        image: item.product.image,
        price: formatPrice(item.product.price),
        stock: item.product.stock,
        category: item.product.category,
        isAvailable: item.product.stock > 0,
      } : null,
      amount: item.amount,
      itemTotal: item.product ? formatPrice(item.product.price * item.amount) : '0.00'
    }));

    res.status(200).json({ 
      success: true, 
      cartItems,
      summary: {
        subtotal: formatPrice(subtotal),
        discount: discountInfo,
        finalTotal: formatPrice(finalTotal),
        itemCount: user.cart.length
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    应用或移除优惠码
 * @route   POST /api/cart/promo
 * @access  Private
 */
const applyPromoCode = async (req, res, next) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const { promoCode } = req.body;
      const userId = req.user.id;

      // 如果promoCode为空，移除当前优惠码
      if (!promoCode) {
        await User.findByIdAndUpdate(userId, { $unset: { activePromoCode: "" } }, { session });
        return;
      }

      // 验证输入
      if (typeof promoCode !== 'string' || !promoCode.trim()) {
        throw new CustomAPIError('Please provide a valid promo code', 400);
      }

      // 查找优惠码
      const promo = await PromoCode.findOne({ 
        code: promoCode.toUpperCase().trim() 
      }).select('_id code discountType discountValue minAmount maxDiscount expiryDate isActive usageLimit usedCount').session(session);
      
      if (!promo) {
        throw new CustomAPIError('Invalid promo code', 404);
      }

      // 检查优惠码是否可用
      if (!promo.isUsable() || promo.isExpired()) {
        throw new CustomAPIError('Promo code is expired or has reached usage limit', 400);
      }

      // 获取用户购物车
      const user = await User.findById(userId).select('cart').session(session);
      if (!user) {
        throw new CustomAPIError('User not found', 404);
      }

      // 计算购物车总价
      const cartTotal = calculateCartTotal(user.cart);
      
      // 检查最低消费要求
      if (cartTotal < promo.minAmount) {
        throw new CustomAPIError(`Minimum amount $${promo.minAmount} required for this promo code`, 400);
      }
      
      await User.findByIdAndUpdate(userId, { activePromoCode: promo._id }, { session });

      await PromoCode.findByIdAndUpdate(promo._id, { $inc: { usedCount: 1 } }, { session });
    });

    res.status(200).json({ 
      success: true, 
      message: 'Promo code action completed successfully' 
    });

  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

/**
 * @desc    清空购物车
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = async (req, res, next) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const userId = req.user.id;
      
      // 同时清空购物车和已应用的优惠码
      const result = await User.findByIdAndUpdate(userId, { 
        $set: { cart: [] },
        $unset: { activePromoCode: "" } 
      }, { session });

      if (!result) {
        throw new CustomAPIError('User not found', 404);
      }
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Cart cleared successfully' 
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

/**
 * @desc    更新购物车商品数量
 * @route   PUT /api/cart/item
 * @access  Private
 */
const updateCartItem = async (req, res, next) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const { productId, amount } = req.body;
      const userId = req.user.id;

      if (!productId || amount < 0) {
        throw new CustomAPIError('Invalid product ID or amount', 400);
      }

      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new CustomAPIError('User not found', 404);
      }

      // 查找商品在购物车中的位置
      const itemIndex = user.cart.findIndex(item => 
        item.product.toString() === productId
      );

      if (amount === 0) {
        // 如果数量为0，移除商品
        user.cart.splice(itemIndex, 1);
      } else if (itemIndex >= 0) {
        // 更新现有商品数量
        user.cart[itemIndex].amount = amount;
      } else {
        // 添加新商品到购物车
        user.cart.push({
          product: productId,
          amount: amount
        });
      }

      await user.save({ session });
    });

    res.status(200).json({ 
      success: true, 
      message: 'Cart item updated successfully' 
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

module.exports = {
  getCart,
  applyPromoCode,
  clearCart,
  updateCartItem
};
