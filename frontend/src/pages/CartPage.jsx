import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  selectCartItems,
  selectCartStatus,
  selectCartError,
  selectCartItemCount,
  clearError,
} from "../feature/cart/cartSlice";
import { token } from "../feature/auth/authSlice";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartStatus = useSelector(selectCartStatus);
  const cartError = useSelector(selectCartError);
  const itemCount = useSelector(selectCartItemCount);
  const authToken = useSelector(token);

  // 响应式状态
  const [isMobile, setIsMobile] = useState(false);

  // 监听窗口大小变化
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 响应式样式
  const responsiveStyles = {
    cartLayout: {
      display: isMobile ? "block" : "flex",
      gap: "24px",
      alignItems: "flex-start",
      width: "100%",
    },
    cartItems: {
      flex: isMobile ? "none" : "1",
      minWidth: 0,
      overflow: "hidden",
    },
    cartSummary: {
      flex: isMobile ? "none" : "0 0 300px",
      minWidth: 0,
      width: isMobile ? "100%" : "300px",
    },
  };

  useEffect(() => {
    if (cartStatus === "idle" && authToken) {
      // 只有在用户已登录且购物车状态为空闲时才获取购物车数据
      dispatch(fetchCart());
    }
  }, [cartStatus, dispatch, authToken]);

  // 清除错误状态
  useEffect(() => {
    if (cartError) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [cartError, dispatch]);

  // 未登录状态
  if (!authToken) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            maxWidth: "400px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "20px",
            }}
          >
            🛒
          </div>
          <h2 style={{ margin: "0 0 16px 0", color: "#333" }}>
            Please Sign In
          </h2>
          <p style={{ margin: "0 0 24px 0", color: "#666", lineHeight: "1.5" }}>
            You need to be signed in to view your shopping cart.
          </p>
          <button
            onClick={() => {
              // 这里可以触发登录模态框或跳转到登录页面
              window.location.reload(); // 临时解决方案，刷新页面会触发登录检查
            }}
            style={{
              padding: "12px 24px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // 加载状态
  if (cartStatus === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          fontSize: "18px",
          color: "#666",
        }}
      >
        <div>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          Loading your cart...
        </div>
      </div>
    );
  }

  // 错误状态
  if (cartStatus === "failed") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "16px",
            color: "#dc3545",
          }}
        >
          ⚠️
        </div>
        <h3
          style={{
            margin: "0 0 8px 0",
            color: "#dc3545",
            fontSize: "20px",
          }}
        >
          Error Loading Cart
        </h3>
        <p
          style={{
            margin: "0 0 16px 0",
            color: "#666",
            fontSize: "14px",
          }}
        >
          {cartError || "Something went wrong. Please try again."}
        </p>
        <button
          onClick={() => dispatch(fetchCart())}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // 空购物车状态
  if (cartStatus === "succeeded" && cartItems.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            fontSize: "64px",
            marginBottom: "24px",
            color: "#ccc",
          }}
        >
          🛒
        </div>
        <h2
          style={{
            margin: "0 0 12px 0",
            fontSize: "24px",
            color: "#333",
          }}
        >
          Your cart is empty
        </h2>
        <p
          style={{
            margin: "0 0 24px 0",
            color: "#666",
            fontSize: "16px",
            maxWidth: "400px",
          }}
        >
          Looks like you haven't added any items to your cart yet. Start
          shopping to add some great products!
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // 正常状态 - 显示购物车内容
  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "16px",
        width: "100%",
      }}
    >
      {/* 页面标题 */}
      <div
        style={{
          marginBottom: "32px",
          borderBottom: "2px solid #e0e0e0",
          paddingBottom: "16px",
        }}
      >
        <h1
          style={{
            margin: "0 0 8px 0",
            fontSize: "28px",
            fontWeight: "700",
            color: "#333",
          }}
        >
          Shopping Cart
        </h1>
        <p
          style={{
            margin: "0",
            fontSize: "16px",
            color: "#666",
          }}
        >
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {/* 错误提示 */}
      {cartError && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "6px",
            padding: "12px 16px",
            marginBottom: "24px",
            color: "#721c24",
            fontSize: "14px",
          }}
        >
          ⚠️ {cartError}
        </div>
      )}

      {/* 主要内容区域 - 响应式布局 */}
      <div
        className="cart-layout"
        style={responsiveStyles.cartLayout}
      >
        {/* 购物车商品列表 */}
        <div style={responsiveStyles.cartItems}>
          <h2
            style={{
              margin: "0 0 20px 0",
              fontSize: "20px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Cart Items
          </h2>

          {cartItems.map((item) => (
            <CartItem key={`${item.product?._id}-${item.amount}`} item={item} />
          ))}
        </div>

        {/* 购物车摘要 */}
        <div style={responsiveStyles.cartSummary}>
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
