const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
require('dotenv').config();

// 导入路由
const cartRouter = require('./routers/cart');

// 导入错误处理中间件
const errorHandlerMiddleware = require('./middlewares/errorHandler');

// 测试数据已移除，如需要可手动插入测试数据

const app = express();

// 数据库连接
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chuwa');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

// 中间件配置
app.use(cors({
  origin: "*", 
}));

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由配置
app.use("/api/cart", cartRouter);

// 健康检查端点
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Cart API V1 is running" });
});

// 错误处理中间件
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Cart API V1 server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
