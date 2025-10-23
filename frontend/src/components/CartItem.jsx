import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCartItem, fetchCart } from "../feature/cart/cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.amount);
  const [isUpdating, setIsUpdating] = useState(false);

  // 同步本地状态与 Redux 状态
  useEffect(() => {
    setQuantity(item.amount);
  }, [item.amount]);

  console.log(item);
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 0) return;

    setIsUpdating(true);
    try {
      await dispatch(
        updateCartItem({
          productId: item.product._id,
          amount: newQuantity,
        })
      ).unwrap();
      // 更新成功后重新获取购物车数据
      dispatch(fetchCart());
    } catch (error) {
      console.error("Failed to update cart item:", error);
      // 恢复原数量
      setQuantity(item.amount);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = () => {
    handleQuantityChange(0);
  };

  const itemTotal = (item.product?.price || 0) * item.amount;

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        display: "flex",
        gap: "16px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        minWidth: 0, // 防止flex子元素溢出
        overflow: "hidden", // 隐藏溢出内容
      }}
    >
      {/* 商品图片 */}
      <div style={{ flexShrink: 0 }}>
        <img
          src={
            item.product?.image ||
            "https://via.placeholder.com/100x100?text=No+Image"
          }
          alt={item.product?.productName || "Product"}
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* 商品信息 */}
      <div style={{ 
        flex: 1, 
        minWidth: 0, 
        overflow: "hidden",
        maxWidth: "calc(100% - 200px)", // 为图片和价格留出空间
      }}>
        <h4
          style={{
            margin: "0 0 8px 0",
            fontSize: "18px",
            fontWeight: "600",
            color: "#333",
            wordWrap: "break-word",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.product?.productName || "Unknown Product"}
        </h4>

        <p
          style={{
            margin: "0 0 8px 0",
            color: "#666",
            fontSize: "14px",
            wordWrap: "break-word",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: "1.4",
          }}
        >
          {item.product?.description || "No description available"}
        </p>

        <p
          style={{
            margin: "0 0 12px 0",
            fontSize: "16px",
            fontWeight: "500",
            color: "#2c5aa0",
          }}
        >
          ${(parseFloat(item.product?.price) || 0).toFixed(2)}
        </p>

        {/* 数量控制 */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          flexWrap: "wrap", // 允许换行
          maxWidth: "100%", // 限制最大宽度
        }}>
          <label style={{ fontSize: "14px", fontWeight: "500" }}>
            Quantity:
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={isUpdating || quantity <= 0}
              style={{
                width: "32px",
                height: "32px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: quantity <= 0 ? "#f5f5f5" : "#fff",
                cursor: quantity <= 0 ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                flexShrink: 0, // 防止按钮收缩
              }}
            >
              -
            </button>

            <span
              style={{
                minWidth: "40px",
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "500",
                flexShrink: 0, // 防止数字收缩
              }}
            >
              {isUpdating ? "..." : quantity}
            </span>

            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isUpdating}
              style={{
                width: "32px",
                height: "32px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#fff",
                cursor: isUpdating ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                flexShrink: 0, // 防止按钮收缩
              }}
            >
              +
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={isUpdating}
            style={{
              padding: "6px 12px",
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isUpdating ? "not-allowed" : "pointer",
              fontSize: "14px",
              opacity: isUpdating ? 0.6 : 1,
              flexShrink: 0, // 防止按钮收缩
              whiteSpace: "nowrap", // 防止文字换行
            }}
          >
            Remove
          </button>
        </div>
      </div>

      {/* 商品总价 */}
      <div
        style={{
          flexShrink: 0,
          textAlign: "right",
          alignSelf: "flex-start",
          minWidth: "120px", // 确保有足够空间显示价格
          maxWidth: "150px", // 限制最大宽度
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#333",
            marginBottom: "4px",
            wordWrap: "break-word",
            overflow: "hidden",
          }}
        >
          ${itemTotal.toFixed(2)}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            wordWrap: "break-word",
            overflow: "hidden",
          }}
        >
          {item.amount} × ${(parseFloat(item.product?.price) || 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
