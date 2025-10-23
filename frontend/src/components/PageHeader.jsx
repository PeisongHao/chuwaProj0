import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SigninModal } from "./SignInModal/SignInModal";
import { Layout, Col, Typography, Menu } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { token, logout } from "../feature/auth/authSlice";
import { fetchCart, selectCartTotal, selectCartItemCount, selectCartTotalQuantity, clearCartState } from "../feature/cart/cartSlice";
import { useSelector, useDispatch } from "react-redux";
const { Header } = Layout;
const { Text } = Typography;

function PageHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const authToken = useSelector(token);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemCount = useSelector(selectCartItemCount);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);

  useEffect(() => {
    if (authToken) {
      // 用户已登录，获取购物车数据
      dispatch(fetchCart());
    }
    // 用户未登录时，不需要调用API，购物车状态会通过Redux自动清空
  }, [dispatch, authToken]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {modalOpen && (
        <SigninModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}
      <Header
        style={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          color: "#111827",
          padding: "0 16px",
        }}
      >
        <Col xs={10} sm={6} md={6} lg={6} xl={6}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            height: "100%"
          }}>
            <button
              onClick={() => navigate("/home")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "4px",
                transition: "background-color 0.2s",
                textAlign: "left"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
            >
              <Text 
                strong 
                style={{ 
                  color: "#fff", 
                  fontSize: windowWidth < 350 ? "12px" : windowWidth < 400 ? "14px" : "18px",
                  display: "block",
                  lineHeight: "1.2",
                  margin: 0
                }}
              >
                Management
              </Text>
              <Text 
                style={{ 
                  color: "#fff", 
                  fontSize: windowWidth < 350 ? "8px" : windowWidth < 400 ? "10px" : "12px",
                  display: "block",
                  margin: 0
                }}
              >
                Chuwa
              </Text>
            </button>
          </div>
        </Col>
        <Col xs={14} sm={12} md={12} lg={12} xl={12}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "flex-end",
            height: "100%",
            gap: "16px"
          }}>
            <button
              onClick={() => {
                if (authToken) {
                  // 登出时清空前端购物车状态，但保留后端数据
                  dispatch(clearCartState());
                  dispatch(logout());
                } else {
                  setModalOpen(true);
                }
              }}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "8px",
                borderRadius: "4px",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
            >
              <UserOutlined style={{ fontSize: "18px" }} />
              <span style={{ display: windowWidth > 768 ? "inline" : "none" }}>
                {authToken ? "Log Out" : "Sign In"}
              </span>
            </button>
            
            <button
              onClick={() => {
                if (authToken) {
                  // 用户已登录，获取购物车数据并跳转
                  dispatch(fetchCart());
                  navigate("/cart");
                } else {
                  // 用户未登录，直接跳转到购物车页面（会显示空购物车或登录提示）
                  navigate("/cart");
                }
              }}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "8px",
                borderRadius: "4px",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
            >
              <ShoppingCartOutlined style={{ fontSize: "18px" }} />
              <span style={{ fontSize: "14px" }}>
                {cartTotalQuantity} items
              </span>
            </button>
          </div>
        </Col>
      </Header>
    </>
  );
}

export default PageHeader;
