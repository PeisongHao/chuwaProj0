import React, { useState } from "react";
import { Layout, Col, Typography, Form, Input, Menu } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
const { Header } = Layout;
const { Text } = Typography;

function PageHeader() {
  return (
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
              label: (
                <div>
                  <UserOutlined style={{ fontSize: "24px" }} />
                  &nbsp; Sign In
                </div>
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
  );
}

export default PageHeader;
