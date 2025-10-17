import React, { useState } from "react";
import { Layout, Col, Typography, Menu } from "antd";
import {
  YoutubeFilled,
  TwitterOutlined,
  FacebookFilled,
} from "@ant-design/icons";
const { Footer } = Layout;
const { Text } = Typography;

function PageFooter() {
  return (
    <Footer
      style={{
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#111827",
      }}
    >
      <Col span={8}>
        <Text style={{ color: "#fff" }}>©2022 All Rights Reserved.</Text>
      </Col>
      <Col span={8}>
        <div style={{ color: "#fff", fontSize: "20px" }}>
          <YoutubeFilled />
          &nbsp;
          <TwitterOutlined />
          &nbsp;
          <FacebookFilled />
        </div>
      </Col>
      <Col span={8}>
        <Menu
          theme="dark"
          mode="horizontal"
          items={[
            { key: "1", label: "Contact us" },
            { key: "2", label: "Privacy Policies" },
            { key: "3", label: "Help" },
          ]}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Col>
    </Footer>
  );
}

export default PageFooter;
