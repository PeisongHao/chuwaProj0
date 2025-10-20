import React from "react";
import { Link } from "react-router-dom";
import { Layout, Typography, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Content } = Layout;
const { Text } = Typography;

const Error = () => {
  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 0,
        height: "100%",
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <ExclamationCircleOutlined
            style={{ color: "#1677ff", fontSize: "64px" }}
          />
          <br />
          <br />
          <Text strong style={{ fontSize: "32px" }}>
            Oops, something went wrong!
          </Text>
          <br />
          <br />
          <Link to="/home">
            <Button type="primary" style={{ fontSize: "16px" }}>
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </Content>
  );
};

export default Error;
