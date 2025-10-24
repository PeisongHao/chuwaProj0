import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCart,
  applyPromoCode,
  fetchCart,
  selectCartTotal,
  selectCartItemCount,
  selectPromoCode,
  selectCartError,
  clearError,
} from "../feature/cart/cartSlice";

const CartSummary = () => {
  const dispatch = useDispatch();
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const promoCode = useSelector(selectPromoCode);
  const cartError = useSelector(selectCartError);
  const [promoInput, setPromoInput] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [promoError, setPromoError] = useState("");

  // 显示promo code错误
  useEffect(() => {
    if (cartError) {
      setPromoError(cartError);
      dispatch(clearError());
    }
  }, [cartError, dispatch]);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;

    setPromoError("");
    setIsApplyingPromo(true);
    
    try {
      await dispatch(applyPromoCode(promoInput.trim())).unwrap();
      await dispatch(fetchCart()); // 重新获取购物车数据
      setPromoInput("");
    } catch (error) {
      console.error("Failed to apply promo code:", error);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    setIsClearing(true);
    try {
      await dispatch(clearCart()).unwrap();
    } catch (error) {
      console.error("Failed to clear cart:", error);
      alert("Failed to clear cart. Please try again.");
    } finally {
      setIsClearing(false);
    }
  };

  // 计算折扣
  const calculateDiscount = () => {
    if (!promoCode) return 0;
    
    return promoCode.type === "percentage" 
      ? (total * promoCode.value) / 100
      : promoCode.value;
  };

  const discountAmount = calculateDiscount();
  const finalTotal = Math.max(total - discountAmount, 0);

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "24px",
        marginTop: "24px",
        minHeight: "200px",
      }}
    >
      <h3
        style={{
          margin: "0 0 20px 0",
          fontSize: "20px",
          fontWeight: "600",
          color: "#333",
        }}
      >
        Cart Summary
      </h3>

      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          <span>Items ({itemCount}):</span>
          <span>${parseFloat(total).toFixed(2)}</span>
        </div>

        {/* promo code输入框 */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <input
              type="text"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value.toUpperCase());
                if (promoError) setPromoError(""); // 输入时清除错误
              }}
              placeholder="Enter promo code"
              style={{
                flex: 1,
                padding: "8px 12px",
                border: promoError ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
              onKeyPress={(e) => e.key === "Enter" && handleApplyPromo()}
            />
            <button
              onClick={handleApplyPromo}
              disabled={isApplyingPromo || !promoInput.trim()}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isApplyingPromo ? "not-allowed" : "pointer",
                fontSize: "14px",
                opacity: isApplyingPromo ? 0.6 : 1,
              }}
            >
              {isApplyingPromo ? "Applying..." : "Apply"}
            </button>
          </div>

          {promoError && (
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: "#f8d7da",
                border: "1px solid #f5c6cb",
                borderRadius: "4px",
                fontSize: "14px",
                color: "#721c24",
                marginBottom: "8px",
              }}
            >
              {promoError}
            </div>
          )}

          {promoCode && (
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: "4px",
                fontSize: "14px",
                color: "#155724",
              }}
            >
              {promoCode.code} applied - {promoCode.type === "percentage" ? `${promoCode.value}% off` : `$${promoCode.value} off`}
            </div>
          )}
        </div>

        {discountAmount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              fontSize: "14px",
              color: "#28a745",
            }}
          >
            <span>Discount:</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: "1px solid #e0e0e0",
          margin: "16px 0",
        }}
      ></div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          fontSize: "18px",
          fontWeight: "600",
          color: "#333",
        }}
      >
        <span>Total:</span>
        <span>${finalTotal.toFixed(2)}</span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexDirection: "column",
        }}
      >
        {/* 结账按钮 - for reminding */}
        <button
          onClick={() => alert("Checkout functionality would be implemented here")}
          disabled={itemCount === 0}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: itemCount === 0 ? "#6c757d" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: itemCount === 0 ? "not-allowed" : "pointer",
          }}
        >
          Proceed to Checkout
        </button>

        <button
          onClick={handleClearCart}
          disabled={isClearing || itemCount === 0}
          style={{
            width: "100%",
            padding: "8px",
            backgroundColor: itemCount === 0 ? "#f8f9fa" : "#dc3545",
            color: itemCount === 0 ? "#6c757d" : "white",
            border: "1px solid #dc3545",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: itemCount === 0 ? "not-allowed" : "pointer",
            opacity: isClearing ? 0.6 : 1,
          }}
        >
          {isClearing ? "Clearing..." : "Clear Cart"}
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
