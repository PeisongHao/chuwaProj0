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
const { Content } = Layout;
const { Title, Text } = Typography;

const Detail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const detail = useSelector((state) => state.detail.data);
  const status = useSelector((state) => state.detail.status);
  const token = useSelector((state) => state.auth.token);
  const [count, setCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const isAdmin = useSelector((state) => state.auth.isAdmin);

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

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    fetch(`http://localhost:3000/api/product/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        messageApi.error("Submit error");
      } else {
        messageApi
          .success("Submit success", 3)
          .then(dispatch(fetchAll({ sort: "fromNew", page: 1 })))
          .then(navigate("/home?sort=fromNew&page=1"));
      }
    });
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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
            <Text style={{ fontSize: "16px", color: "#000" }}>Quantity:</Text>
            <InputNumber
              min={0}
              max={detail.stock}
              defaultValue={0}
              onChange={onChange}
            />
            &nbsp;
            <Button type="primary" style={{ fontSize: "16px" }}>
              Add To Cart
            </Button>
            {isAdmin ? (
              <>
                <br />
                <Link to={`/edit/${id}`}>
                  <Button style={{ fontSize: "16px" }}>Edit</Button>
                </Link>
                &nbsp;
                <Button
                  type="primary"
                  danger
                  style={{ fontSize: "16px" }}
                  onClick={showModal}
                >
                  Delete
                </Button>
                <Modal
                  title="Warning"
                  closable={{ "aria-label": "Custom Close Button" }}
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  Are you sure you want to delete the product? This product will
                  be permanently removed.
                </Modal>
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
