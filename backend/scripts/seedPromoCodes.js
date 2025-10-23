const mongoose = require("mongoose");
const PromoCode = require("../models/PromoCode.js");
require("dotenv").config();

// 连接数据库
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/chuwa";
    console.log("Connecting to:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const samplePromoCodes = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minAmount: 50,
    maxDiscount: 20,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后过期
    usageLimit: 100,
    isActive: true,
  },
  {
    code: "SAVE20",
    discountType: "percentage",
    discountValue: 20,
    minAmount: 100,
    maxDiscount: 50,
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60天后过期
    usageLimit: 50,
    isActive: true,
  },
  {
    code: "FREESHIP",
    discountType: "shipping",
    discountValue: 0,
    minAmount: 75,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90天后过期
    usageLimit: 200,
    isActive: true,
  },
  {
    code: "FLAT15",
    discountType: "fixed",
    discountValue: 15,
    minAmount: 80,
    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45天后过期
    usageLimit: 75,
    isActive: true,
  },
  {
    code: "NEWUSER",
    discountType: "percentage",
    discountValue: 25,
    minAmount: 30,
    maxDiscount: 30,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14天后过期
    usageLimit: 1,
    isActive: true,
  },
  {
    code: "BULK30",
    discountType: "percentage",
    discountValue: 30,
    minAmount: 200,
    maxDiscount: 100,
    expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120天后过期
    usageLimit: 25,
    isActive: true,
  },
  {
    code: "WEEKEND",
    discountType: "fixed",
    discountValue: 25,
    minAmount: 100,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
    usageLimit: 150,
    isActive: true,
  },
  {
    code: "EXPIRED",
    discountType: "percentage",
    discountValue: 50,
    minAmount: 0,
    expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 已过期
    usageLimit: 10,
    isActive: true,
  },
  {
    code: "INACTIVE",
    discountType: "percentage",
    discountValue: 15,
    minAmount: 50,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    usageLimit: 50,
    isActive: false, // 未激活
  },
  {
    code: "LIMITED",
    discountType: "percentage",
    discountValue: 40,
    minAmount: 150,
    maxDiscount: 80,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    usageLimit: 5,
    usedCount: 5, // 已达到使用限制
    isActive: true,
  },
];

// 清空现有优惠码并添加示例数据
const seedPromoCodes = async () => {
  try {
    // 清空现有优惠码
    await PromoCode.deleteMany({});
    console.log("Cleared existing promo codes");

    // 添加示例优惠码
    const createdPromoCodes = await PromoCode.insertMany(samplePromoCodes);
    console.log(`Successfully created ${createdPromoCodes.length} promo codes:`);
    
    createdPromoCodes.forEach(promo => {
      console.log(`- ${promo.code}: ${promo.discountType} ${promo.discountValue}${promo.discountType === 'percentage' ? '%' : '$'} off (min: $${promo.minAmount})`);
    });

  } catch (error) {
    console.error("Error seeding promo codes:", error);
  }
};

// 主函数
const main = async () => {
  await connectDB();
  await seedPromoCodes();
  await mongoose.connection.close();
  console.log("Database connection closed");
  process.exit(0);
};

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { seedPromoCodes, samplePromoCodes };
