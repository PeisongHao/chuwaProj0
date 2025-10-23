const mongoose = require("mongoose");
const Product = require("../models/Product.js");
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

// 多样化的产品数据
const sampleProducts = [
  {
    productName: "iPhone 15 Pro",
    description: "Latest iPhone with titanium design, A17 Pro chip, and advanced camera system. Perfect for photography and gaming.",
    price: 999,
    stock: 50,
    category: "Smartphone",
    image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702700"
  },
  {
    productName: "MacBook Air M3",
    description: "Ultra-thin laptop with M3 chip, 13-inch Liquid Retina display, and all-day battery life. Perfect for work and creativity.",
    price: 1299,
    stock: 30,
    category: "Laptop",
    image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665"
  },
  {
    productName: "Sony WH-1000XM5",
    description: "Premium noise-canceling wireless headphones with industry-leading sound quality and 30-hour battery life.",
    price: 399,
    stock: 75,
    category: "Audio",
    image: "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SX679_.jpg"
  },
  {
    productName: "Nintendo Switch OLED",
    description: "Gaming console with 7-inch OLED screen, enhanced audio, and 64GB internal storage. Includes Joy-Con controllers.",
    price: 349,
    stock: 40,
    category: "Gaming",
    image: "https://m.media-amazon.com/images/I/61l9VRIqLwL._AC_SX679_.jpg"
  },
  {
    productName: "Samsung Galaxy S24",
    description: "Android flagship with AI-powered features, 200MP camera, and all-day battery. Sleek design with titanium frame.",
    price: 799,
    stock: 60,
    category: "Smartphone",
    image: "https://m.media-amazon.com/images/I/71d2RNCq-0L._AC_SX679_.jpg"
  },
  {
    productName: "iPad Pro 12.9\"",
    description: "Professional tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support. Perfect for artists and professionals.",
    price: 1099,
    stock: 25,
    category: "Tablet",
    image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-12-select-wifi-spacegray-202210?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1664411200794"
  },
  {
    productName: "AirPods Pro 2nd Gen",
    description: "Wireless earbuds with active noise cancellation, spatial audio, and adaptive transparency mode.",
    price: 249,
    stock: 100,
    category: "Audio",
    image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361"
  },
  {
    productName: "PlayStation 5",
    description: "Next-gen gaming console with 4K gaming, ray tracing, and ultra-fast SSD. Includes DualSense wireless controller.",
    price: 499,
    stock: 20,
    category: "Gaming",
    image: "https://m.media-amazon.com/images/I/51wJL3j8RUL._AC_SX679_.jpg"
  },
  {
    productName: "Dell XPS 13",
    description: "Ultrabook with 13.4-inch InfinityEdge display, 11th Gen Intel Core processor, and premium build quality.",
    price: 1199,
    stock: 35,
    category: "Laptop",
    image: "https://m.media-amazon.com/images/I/71F8Tg9jvVL._AC_SX679_.jpg"
  },
  {
    productName: "Apple Watch Series 9",
    description: "Smartwatch with health monitoring, GPS, cellular connectivity, and 18-hour battery life. Multiple band options available.",
    price: 399,
    stock: 80,
    category: "Wearable",
    image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-s9-gps-select-aluminum-pink-202309?wid=5120&hei=3280&fmt=p-jpg&qlt=80&.v=1692923829000"
  },
  {
    productName: "Google Pixel 8",
    description: "Android phone with Google AI, excellent camera system, and pure Android experience with 7 years of updates.",
    price: 699,
    stock: 45,
    category: "Smartphone",
    image: "https://m.media-amazon.com/images/I/61mY7jVEGBL._AC_SX679_.jpg"
  },
  {
    productName: "Surface Pro 9",
    description: "2-in-1 tablet/laptop with detachable keyboard, Surface Pen support, and Windows 11. Perfect for productivity on the go.",
    price: 999,
    stock: 30,
    category: "Tablet",
    image: "https://m.media-amazon.com/images/I/71wC0Hr0KQL._AC_SX679_.jpg"
  },
  {
    productName: "Bose QuietComfort 45",
    description: "Noise-canceling headphones with world-class comfort, clear sound, and up to 24 hours of battery life.",
    price: 329,
    stock: 55,
    category: "Audio",
    image: "https://m.media-amazon.com/images/I/61uBtZoVGrL._AC_SX679_.jpg"
  },
  {
    productName: "Steam Deck",
    description: "Handheld gaming PC with AMD APU, 7-inch touchscreen, and access to thousands of Steam games.",
    price: 399,
    stock: 25,
    category: "Gaming",
    image: "https://m.media-amazon.com/images/I/61a+8dQy4WL._AC_SX679_.jpg"
  },
  {
    productName: "ThinkPad X1 Carbon",
    description: "Business laptop with legendary durability, 14-inch display, and enterprise-grade security features.",
    price: 1499,
    stock: 20,
    category: "Laptop",
    image: "https://m.media-amazon.com/images/I/71Gp4J6z3VL._AC_SX679_.jpg"
  }
];

// 清空现有产品并添加新数据
const seedProducts = async () => {
  try {
    // 清空现有产品
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // 添加新产品
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully created ${createdProducts.length} products:`);
    
    createdProducts.forEach(product => {
      console.log(`- ${product.productName}: $${product.price} (${product.category})`);
    });

  } catch (error) {
    console.error("Error seeding products:", error);
  }
};

// 主函数
const main = async () => {
  await connectDB();
  await seedProducts();
  await mongoose.connection.close();
  console.log("Database connection closed");
  process.exit(0);
};

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { seedProducts, sampleProducts };
