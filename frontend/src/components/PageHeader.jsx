import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SigninModal } from "./SignInModal/SignInModal";
import { Layout, Col, Typography, Form, Input, Menu } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { token, logout } from "../feature/auth/authSlice";
import { fetchCart, selectCartTotal } from "../feature/cart/cartSlice";
import { useSelector, useDispatch } from "react-redux";
const { Header } = Layout;
const { Text } = Typography;

function PageHeader() {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const authToken = useSelector(token);
  const cartTotal = useSelector(selectCartTotal);

  useEffect(() => {
    dispatch(fetchCart());
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
        }}
      >
        <Col span={6}>
          <Text strong style={{ color: "#fff", fontSize: "22px" }}>
            Management{" "}
          </Text>
          <Text style={{ color: "#fff", fontSize: "10px" }}>Chuwa</Text>
        </Col>
        <Col span={12}>
          <Form name="search" layout="inline">
            <Input.Search placeholder="Search" />
          </Form>
        </Col>
        <Col span={6}>
          <Menu
            theme="dark"
            mode="horizontal"
            items={[
              {
                key: "1",
                label: authToken ? (
                  <button
                    onClick={() => {
                      dispatch(logout());
                    }}
                  >
                    <UserOutlined style={{ fontSize: "24px" }} />
                    &nbsp; Log Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setModalOpen(true);
                    }}
                  >
                    <UserOutlined style={{ fontSize: "24px" }} />
                    &nbsp; Sign In
                  </button>
                ),
              },
              {
                key: "2",
                label: (
                  <Link to="/cart">
                    <ShoppingCartOutlined style={{ fontSize: "24px" }} />
                    &nbsp; ${cartTotal}
                  </Link>
                ),
              },
            ]}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Col>
      </Header>
    </>
  );
}

export default PageHeader;
