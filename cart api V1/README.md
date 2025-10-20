# Cart API V1

高性能购物车API模块，支持事务处理、优惠码状态持久化和自动过期检查。

## 🚀 快速开始

### 安装和启动
```bash
# 后端
cd "cart api V1/backend"
npm install
npm start

# 前端
cd "cart api V1/frontend"
npm install
npm run dev
```

服务器运行在 `http://localhost:3000`

## 📋 API 端点

### 1. 获取购物车详情
```bash
GET /api/cart
Headers: x-auth-token: your_jwt_token
```

**响应示例：**
```json
{
  "success": true,
  "cartItems": [...],
  "summary": {
    "subtotal": "100.00",
    "discount": {
      "code": "SAVE10",
      "type": "percentage",
      "value": 10,
      "discountAmount": "10.00"
    },
    "finalTotal": "90.00",
    "itemCount": 3
  }
}
```

### 2. 应用优惠码
```bash
POST /api/cart/promo
Headers: x-auth-token: your_jwt_token
Content-Type: application/json

Body: {"promoCode": "SAVE10"}
```

### 3. 清空购物车
```bash
DELETE /api/cart
Headers: x-auth-token: your_jwt_token
```

## 🧪 测试优惠码

系统预置测试优惠码：
- **SAVE10** - 10%折扣，最低消费$50
- **20OFF** - 立减$20，最低消费$100
- **FREESHIP** - 免运费，最低消费$25
- **EXPIRED** - 已过期（测试错误处理）

## ⚡ 性能特性

- **单次查询**：获取购物车和优惠码信息
- **事务处理**：确保数据一致性
- **状态持久化**：优惠码状态保存到数据库
- **自动清理**：过期优惠码自动移除
- **API整合**：合并相关功能，减少调用次数

## 🔧 技术栈

- **后端**: Node.js, Express, MongoDB, Mongoose
- **前端**: React 19, Redux Toolkit, Ant Design
- **认证**: JWT