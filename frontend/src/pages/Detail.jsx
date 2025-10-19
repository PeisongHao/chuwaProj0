import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Layout, Typography, Row, Col, Tag, Button, InputNumber } from "antd";
import { fetchDetailById } from "../feature/product/detailSlice";
const { Content } = Layout;
const { Title, Text } = Typography;

const Detail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const detail = useSelector((state) => state.detail.data);
  const status = useSelector((state) => state.detail.status);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDetailById(id));
    }
    if (status === "succeeded") {
      if (id !== detail._id) {
        // Do API call again to clear old data
        dispatch(fetchDetailById(id));
      }
    }
  }, [status, dispatch, id]);

  const onChange = (value) => {
    setCount(value);
  };

  let product;
  if (status === "loading") {
    product = "Loading...";
  } else if (status === "succeeded") {
    let stockColor, stockText;
    if (detail.stock > 0) {
      stockColor = "success";
      stockText = `Stock: ${detail.stock}`;
    } else {
      stockColor = "error";
      stockText = "Out of Stock";
    }
    product = (
      <>
        <Row style={{ backgroundColor: "#fff" }}>
          <Col span={12}>
            <img
              style={{ width: "40vw" }}
              alt={detail.productName}
              src={detail.image}
            />
          </Col>
          <Col span={12} style={{ fontSize: "20px", padding: "10px" }}>
            <Text style={{ fontSize: "16px", color: "#6b7280" }}>
              {detail.category}
            </Text>
            <br />
            <Text strong style={{ fontSize: "32px", color: "#535353" }}>
              {detail.productName}
            </Text>
            <br />
            <Text strong style={{ fontSize: "32px", color: "#111827" }}>
              ${detail.price}
            </Text>
            <Tag
              bordered={false}
              color={stockColor}
              style={{ fontSize: "16px" }}
            >
              {stockText}
            </Tag>
            <br />
            <Text style={{ fontSize: "16px", color: "#6b7280" }}>
              {detail.description}
            </Text>
            <br />
            <br />
            <Text style={{ fontSize: "16px", color: "#000" }}>Quantity:</Text>
            <InputNumber
              min={0}
              max={detail.stock}
              defaultValue={0}
              onChange={onChange}
            />
            <br />
            <Button type="primary" style={{ fontSize: "16px" }}>
              Add To Cart
            </Button>
            <Link to={`/edit/${id}`}>
              <Button style={{ fontSize: "16px" }}>Edit</Button>
            </Link>
          </Col>
        </Row>
      </>
    );
  } else if (status === "failed") {
    product = "Internal Server Error";
  }

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
      <Title level={2}>Products Detail</Title>
      <div>{product}</div>
    </Content>
  );
};

export default Detail;
