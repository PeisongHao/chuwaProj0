const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed", "shipping"],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  minAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  maxDiscount: {
    type: Number,
    default: null,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number,
    default: null,
    min: 1,
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 确保优惠码为大写
promoCodeSchema.pre("save", function (next) {
  if (this.code) {
    this.code = this.code.toUpperCase();
  }
  next();
});

// 验证优惠码是否过期
promoCodeSchema.methods.isExpired = function () {
  return new Date() > this.expiryDate;
};

// 验证优惠码是否可用
promoCodeSchema.methods.isUsable = function () {
  if (!this.isActive) return false;
  if (this.isExpired()) return false;
  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
  return true;
};

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

module.exports = PromoCode;
