import React, { useState } from "react";
import { SigninModal } from "./SignInModal/SignInModal";
import { Layout, Col, Typography, Form, Input, Menu } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { token,logout } from "../feature/auth/authSlice";
import { useSelector,useDispatch } from "react-redux";
const { Header } = Layout;
const { Text } = Typography;

function PageHeader() {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const authToken = useSelector(token);
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
                  <button onClick={()=>{dispatch(logout())}}>
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
                  <div>
                    <ShoppingCartOutlined style={{ fontSize: "24px" }} />
                    &nbsp; $0.00
                  </div>
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
