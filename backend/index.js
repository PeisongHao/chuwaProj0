const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const productRouter = require("./routers/product");
const authRouter = require("./routers/auth");
const usersRouter = require("./routers/users");
const cartRouter = require("./routers/cart");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const app = express();

connectDB();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/product", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/cart", cartRouter);

// 健康检查端点
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Cart API V1 is running" });
});

app.use(errorHandlerMiddleware);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log(`Health check: http://localhost:300/health`);
});
