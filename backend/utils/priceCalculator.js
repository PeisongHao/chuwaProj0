/**
 * 价格计算工具 - 纯函数集合
 * 这些函数不依赖外部状态，便于单元测试
 */

/**
 * 计算单个商品的总价
 * @param {number} price - 商品单价
 * @param {number} amount - 商品数量
 * @returns {number} 商品总价
 */
const calculateItemTotal = (price, amount) => {
  if (price < 0 || amount < 0) {
    throw new Error("Price and amount must be non-negative");
  }
  return price * amount;
};

/**
 * 计算购物车总价
 * @param {Array} cartItems - 购物车商品数组
 * @returns {number} 购物车总价
 */
const calculateCartTotal = (cartItems) => {
  if (!Array.isArray(cartItems)) {
    throw new Error("Cart items must be an array");
  }

  return cartItems.reduce((total, item) => {
    if (
      !item.product ||
      typeof item.product.price !== "number" ||
      typeof item.amount !== "number"
    ) {
      throw new Error("Invalid cart item structure");
    }
    return total + calculateItemTotal(item.product.price, item.amount);
  }, 0);
};

/**
 * 应用百分比折扣
 * @param {number} amount - 原始金额
 * @param {number} percentage - 折扣百分比 (0-100)
 * @param {number} maxDiscount - 最大折扣金额 (可选)
 * @returns {Object} 折扣信息 {discountAmount, finalAmount}
 */
const applyPercentageDiscount = (amount, percentage, maxDiscount = null) => {
  if (amount < 0 || percentage < 0 || percentage > 100) {
    throw new Error("Invalid discount parameters");
  }

  let discountAmount = (amount * percentage) / 100;

  if (maxDiscount && discountAmount > maxDiscount) {
    discountAmount = maxDiscount;
  }

  return {
    discountAmount: Math.min(discountAmount, amount),
    finalAmount: Math.max(amount - discountAmount, 0),
  };
};

/**
 * 应用固定金额折扣
 * @param {number} amount - 原始金额
 * @param {number} discountValue - 折扣金额
 * @returns {Object} 折扣信息 {discountAmount, finalAmount}
 */
const applyFixedDiscount = (amount, discountValue) => {
  if (amount < 0 || discountValue < 0) {
    throw new Error("Invalid discount parameters");
  }

  const discountAmount = Math.min(discountValue, amount);

  return {
    discountAmount,
    finalAmount: Math.max(amount - discountAmount, 0),
  };
};

/**
 * 应用优惠码折扣
 * @param {number} amount - 原始金额
 * @param {Object} promoCode - 优惠码对象
 * @returns {Object} 折扣信息 {discountAmount, finalAmount, discountType}
 */
const applyPromoDiscount = (amount, promoCode) => {
  if (!promoCode || !promoCode.isUsable()) {
    throw new Error("Promo code is not valid or expired");
  }

  if (amount < promoCode.minAmount) {
    throw new Error(
      `Minimum amount ${promoCode.minAmount} required for this promo code`
    );
  }

  let result;

  switch (promoCode.discountType) {
    case "percentage":
      result = applyPercentageDiscount(
        amount,
        promoCode.discountValue,
        promoCode.maxDiscount
      );
      break;
    case "fixed":
      result = applyFixedDiscount(amount, promoCode.discountValue);
      break;
    case "shipping":
      // 免运费逻辑，这里简化为返回原金额
      result = {
        discountAmount: 0,
        finalAmount: amount,
        freeShipping: true,
      };
      break;
    default:
      throw new Error("Invalid discount type");
  }

  return {
    ...result,
    discountType: promoCode.discountType,
    promoCode: promoCode.code,
  };
};

/**
 * 格式化价格显示
 * @param {number} price - 价格数值
 * @param {number} decimals - 小数位数，默认2位
 * @returns {string} 格式化后的价格字符串
 */
const formatPrice = (price, decimals = 2) => {
  if (typeof price !== "number") {
    throw new Error("Price must be a number");
  }
  return price.toFixed(decimals);
};

/**
 * 计算税费 (预留功能)
 * @param {number} amount - 税前金额
 * @param {number} taxRate - 税率 (0-1)
 * @returns {Object} 税费信息 {taxAmount, totalAmount}
 */
const calculateTax = (amount, taxRate = 0.08) => {
  if (amount < 0 || taxRate < 0 || taxRate > 1) {
    throw new Error("Invalid tax parameters");
  }

  const taxAmount = amount * taxRate;

  return {
    taxAmount,
    totalAmount: amount + taxAmount,
  };
};

module.exports = {
  calculateItemTotal,
  calculateCartTotal,
  applyPercentageDiscount,
  applyFixedDiscount,
  applyPromoDiscount,
  formatPrice,
  calculateTax,
};
