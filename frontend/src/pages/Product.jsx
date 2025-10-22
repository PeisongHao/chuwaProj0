import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Layout,
  Typography,
  List,
  Card,
  InputNumber,
  Button,
  Select,
  Flex,
  Pagination,
  ConfigProvider,
  Space,
  Modal,
} from "antd";
const { Content } = Layout;
const { Text } = Typography;
const { Meta } = Card;
import { fetchAll } from "../feature/product/productSlice";
import { updateCartItem } from "../feature/cart/cartSlice";

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useSelector((state) => state.product.data);
  const status = useSelector((state) => state.product.status);
  const [sort, setSort] = useState("fromNew");
  const [page, setPage] = useState("1");
  const [cartNum, setCartNum] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (searchParams.size === 0) {
      navigate("/home?sort=fromNew&page=1"); // From /home to default query params
    } else {
      setSort(searchParams.get("sort"));
      setPage(searchParams.get("page"));
    }
  }, []);

  useEffect(() => {
    if (status === "idle") {
      dispatch(
        fetchAll({
          sort: searchParams.get("sort") || "fromNew", // Default value
          page: searchParams.get("page") || 1, // Default value
        })
      );
    }
  }, [status, dispatch]);

  const onSortChange = (value) => {
    setSort(value);
    navigate(`/home?sort=${value}&page=${page}`);
    dispatch(fetchAll({ sort: value, page: searchParams.get("page") }));
  };

  const onPageChange = (value) => {
    setPage(value);
    navigate(`/home?sort=${sort}&page=${parseInt(value)}`);
    dispatch(
      fetchAll({ sort: searchParams.get("sort"), page: parseInt(value) })
    );
  };

  const handleCart = (id, index) => {
    if (token === null) {
      showModal();
    } else {
      dispatch(updateCartItem({ productId: id, amount: cartNum[index] }));
    }
  };

  const handleInputChange = (value, index) => {
    let oldArray = cartNum;
    oldArray[index] = value;
    setCartNum(oldArray);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setIsModalOpen(false);
  };

  let list;
  if (status === "loading") {
    list = "Loading...";
  } else if (status === "succeeded") {
    list =
      products.length === 0 ? (
        "No products found."
      ) : (
        <>
          <List
            style={{ marginTop: 20 }}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 5,
              xxl: 5,
            }}
            dataSource={products.products}
            renderItem={(item, index) => (
              <List.Item>
                <ConfigProvider
                  theme={{
                    components: {
                      Card: {
                        bodyPadding: 12, // Change card body padding from 24 to 12
                      },
                    },
                  }}
                >
                  <Card
                    cover={
                      <Link to={`/product/${item._id}`}>
                        <img
                          alt="Image load failed"
                          src={item.image}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </Link>
                    }
                    key={item._id}
                    style={{ padding: "0px" }}
                  >
                    <Text
                      ellipsis={true}
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        maxWidth: 150,
                      }}
                    >
                      {item.productName}
                    </Text>
                    <br />
                    <Text strong style={{ fontSize: "16px", color: "#111827" }}>
                      ${item.price}
                    </Text>
                    <br />
                    <div>
                      {isAdmin ? (
                        <>
                          <Space.Compact style={{ width: "48%" }}>
                            <InputNumber
                              min={0}
                              max={item.stock}
                              defaultValue={0}
                              style={{ fontSize: "12px" }}
                              onChange={(value) =>
                                handleInputChange(value, index)
                              }
                            />
                            <Button
                              style={{ width: "1%" }}
                              onClick={() => handleCart(item._id, index)}
                            >
                              +
                            </Button>
                          </Space.Compact>
                          <Link to={`/edit/${item._id}`}>
                            <Button
                              style={{
                                fontSize: "12px",
                                width: "48%",
                                float: "right",
                              }}
                            >
                              Edit
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <Space.Compact style={{ width: "100%" }}>
                          <InputNumber
                            min={0}
                            max={item.stock}
                            defaultValue={0}
                            style={{ fontSize: "12px" }}
                            onChange={(value) =>
                              handleInputChange(value, index)
                            }
                          />
                          <Button
                            style={{ width: "1%" }}
                            onClick={() => handleCart(item._id, index)}
                          >
                            +
                          </Button>
                        </Space.Compact>
                      )}
                    </div>
                  </Card>
                </ConfigProvider>
              </List.Item>
            )}
          />
          <Pagination
            current={page}
            onChange={onPageChange}
            total={products.count}
          />
          <Modal
            title="Error"
            open={isModalOpen}
            closable={false}
            onOk={handleOk}
            footer={[
              <Button type="primary" key="OK" onClick={handleOk}>
                OK
              </Button>,
            ]}
          >
            Please log in to add products
          </Modal>
        </>
      );
  } else if (status === "failed") {
    list = "Internal Server Error";
  }

  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 0,
        height: 900,
        overflow: "auto",
      }}
    >
      <div>
        <Text strong style={{ fontSize: "30px" }}>
          Products
        </Text>
        <Flex style={{ float: "right", gap: "5px" }}>
          <Select
            value={sort}
            style={{ width: "180px" }}
            onChange={onSortChange}
            options={[
              { value: "fromNew", label: "Last Added" },
              { value: "fromLow", label: "Price: low to high" },
              { value: "fromHigh", label: "Price: high to low" },
            ]}
          />
          {isAdmin ? (
            <Link to={`/create`}>
              <Button type="primary">Add Product</Button>
            </Link>
          ) : (
            ""
          )}
        </Flex>
      </div>
      <br />
      <div>{list}</div>
    </Content>
  );
};

export default Product;
