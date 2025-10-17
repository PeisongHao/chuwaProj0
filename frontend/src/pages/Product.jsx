import React, { useState, useEffect } from "react";
import { Layout } from "antd";
const { Content } = Layout;

const Product = () => {
  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 0,
        height: 800,
        overflow: "auto",
      }}
    >
      <div>Content</div>
    </Content>
  );
};

export default Product;
