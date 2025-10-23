import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Layout,
  Typography,
  Row,
  Col,
  Tag,
  Button,
  InputNumber,
  Modal,
  message,
} from "antd";
import { fetchDetailById } from "../feature/product/detailSlice";
import { fetchAll } from "../feature/product/productSlice";
import { updateCartItem, fetchCart } from "../feature/cart/cartSlice";
const { Content } = Layout;
const { Title, Text } = Typography;

const Detail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const detail = useSelector((state) => state.detail.data);
  const status = useSelector((state) => state.detail.status);
  const token = useSelector((state) => state.auth.token);
  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const items = useSelector((state) => state.cart.items);

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


  const getCartQuantity = (productId) => {
    const cartItem = items.find(item => item.product._id === productId);
    return cartItem ? cartItem.amount : 0;
  };

  const handleQuantityChange = (productId, change) => {
    if (!token) {
      messageApi.warning("Please sign in to add items to cart");
      return;
    }

    const currentQuantity = getCartQuantity(productId);
    const newQuantity = currentQuantity + change;

    if (newQuantity < 0) {
      messageApi.warning("Quantity cannot be negative");
      return;
    }

    if (newQuantity > detail.stock) {
      messageApi.warning(`Cannot add more than ${detail.stock} items`);
      return;
    }

    dispatch(updateCartItem({ productId, amount: newQuantity }))
      .unwrap()
      .then(() => {
        dispatch(fetchCart());
        if (newQuantity === 0) {
          messageApi.success("Item removed from cart");
        } else {
          messageApi.success("Cart updated successfully");
        }
      })
      .catch((error) => {
        console.error("Cart update error:", error);
        if (error.response?.status === 401) {
          messageApi.error("Please sign in to add items to cart");
        } else {
          messageApi.error("Failed to update cart");
        }
      });
  };


  const showLogIn = () => {
    setIsLogInOpen(true);
  };
  const handleLogInOk = async () => {
    setIsLogInOpen(false);
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
        {contextHolder}
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
            <Text style={{ fontSize: "16px", color: "#000", marginRight: "16px" }}>Quantity:</Text>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Button
                size="small"
                onClick={() => handleQuantityChange(id, -1)}
                disabled={getCartQuantity(id) <= 0}
                style={{ 
                  height: "32px",
                  minWidth: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                -
              </Button>
              <InputNumber
                min={0}
                max={detail.stock}
                value={getCartQuantity(id)}
                size="small"
                style={{ 
                  fontSize: "12px", 
                  textAlign: "center",
                  height: "32px",
                  width: "60px",
                  display: "flex",
                  alignItems: "center"
                }}
                controls={false}
                onChange={(value) => {
                  if (value >= 0 && value <= detail.stock) {
                    dispatch(updateCartItem({ productId: id, amount: value }))
                      .unwrap()
                      .then(() => {
                        dispatch(fetchCart());
                        messageApi.success("Cart updated successfully");
                      })
                      .catch((error) => {
                        console.error("Cart update error:", error);
                        if (error.response?.status === 401) {
                          messageApi.error("Please sign in to add items to cart");
                        } else {
                          messageApi.error("Failed to update cart");
                        }
                      });
                  }
                }}
              />
              <Button
                size="small"
                onClick={() => handleQuantityChange(id, 1)}
                disabled={getCartQuantity(id) >= detail.stock}
                style={{ 
                  height: "32px",
                  minWidth: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                +
              </Button>
            </div>
            <Modal
              title="Error"
              open={isLogInOpen}
              closable={false}
              onOk={handleLogInOk}
              footer={[
                <Button type="primary" key="OK" onClick={handleLogInOk}>
                  OK
                </Button>,
              ]}
            >
              Please log in to add products
            </Modal>
            {isAdmin ? (
              <>
                <br />
                <Link to={`/edit/${id}`}>
                  <Button style={{ fontSize: "16px" }}>Edit</Button>
                </Link>
              </>
            ) : (
              ""
            )}
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
