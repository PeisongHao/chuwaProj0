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
  message,
  Input,
} from "antd";
const { Content } = Layout;
const { Text } = Typography;
const { Meta } = Card;
import { fetchAll } from "../feature/product/productSlice";
import { updateCartItem, selectCartItems, fetchCart } from "../feature/cart/cartSlice";

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
  const products = useSelector((state) => state.product.data);
  const status = useSelector((state) => state.product.status);
  const [sort, setSort] = useState("fromNew");
  const [page, setPage] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartNum, setCartNum] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const token = useSelector((state) => state.auth.token);
  const items = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (searchParams.size === 0) {
      navigate("/home?sort=fromNew&page=1"); // From /home to default query params
    } else {
      setSort(searchParams.get("sort"));
      setPage(searchParams.get("page"));
      setSearchQuery(searchParams.get("search") || "");
    }
  }, []);

  useEffect(() => {
    if (status === "idle") {
      const sortParam = searchParams.get("sort") || "fromNew";
      const pageParam = searchParams.get("page") || 1;
      const searchParam = searchParams.get("search") || "";
      
      setSort(sortParam);
      setPage(pageParam);
      setSearchQuery(searchParam);
      
      dispatch(
        fetchAll({
          sort: sortParam,
          page: pageParam,
          search: searchParam,
        })
      );
    }
  }, [status, dispatch, searchParams]);

  // 初始化cartNum数组
  useEffect(() => {
    if (products && products.products) {
      setCartNum(new Array(products.products.length).fill(0));
    }
  }, [products]);

  const onSortChange = (value) => {
    setSort(value);
    navigate(`/home?sort=${value}&page=${page}&search=${searchQuery}`);
    dispatch(fetchAll({ sort: value, page: searchParams.get("page"), search: searchQuery }));
  };

  const onSearchChange = (value) => {
    setSearchQuery(value);
    navigate(`/home?sort=${sort}&page=1&search=${value}`);
    dispatch(fetchAll({ sort: searchParams.get("sort"), page: 1, search: value }));
  };

  const onPageChange = (value) => {
    setPage(value);
    navigate(`/home?sort=${sort}&page=${parseInt(value)}&search=${searchQuery}`);
    dispatch(
      fetchAll({ sort: searchParams.get("sort"), page: parseInt(value), search: searchQuery })
    );
  };


  // 获取购物车中某个商品的数量
  const getCartQuantity = (productId) => {
    const cartItem = items.find(item => item.product._id === productId);
    return cartItem ? cartItem.amount : 0;
  };

  const handleInputChange = (value, index) => {
    let oldArray = cartNum;
    oldArray[index] = value;
    setCartNum(oldArray);
  };

  const handleQuantityChange = (index, change) => {
    // 检查用户是否已登录
    if (!token) {
      messageApi.warning("Please sign in to add items to cart");
      return;
    }
    
    if (!products || !products.products || !products.products[index]) {
      messageApi.error("Product not found");
      return;
    }
    
    const productId = products.products[index]._id;
    const currentQuantity = getCartQuantity(productId);
    const newQuantity = currentQuantity + change;
    
    if (newQuantity >= 0) {
      try {
        // 检查库存
        const product = products.products[index];
        if (newQuantity > product.stock) {
          messageApi.error("Not enough stock available");
          return;
        }
        
        dispatch(
          updateCartItem({ productId: productId, amount: newQuantity })
        ).unwrap().then(() => {
          // 更新成功后重新获取购物车数据以更新头部显示
          dispatch(fetchCart());
        }).catch((error) => {
          if (error.response?.status === 401) {
            messageApi.error("Please sign in to add items to cart");
          } else {
            messageApi.error("Error updating quantity: " + (error.message || "Unknown error"));
          }
        });
      } catch (error) {
        if (error.response?.status === 401) {
          messageApi.error("Please sign in to add items to cart");
        } else {
          messageApi.error("Error updating quantity: " + (error.message || "Unknown error"));
        }
      }
    }
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
          {/* 移动端搜索框 */}
          <div style={{ marginBottom: 20 }}>
            <Input.Search
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={onSearchChange}
              allowClear
              style={{ width: "100%" }}
            />
          </div>
          <List
            style={{ marginTop: 20 }}
            grid={{
              gutter: [16, 16],
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 5,
              xxl: 6,
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
                          <div style={{ marginBottom: "8px", display: "flex", justifyContent: "center" }}>
                            <Space.Compact style={{ width: "auto", display: "flex", alignItems: "stretch" }}>
                              <Button
                                size="small"
                                onClick={() => handleQuantityChange(index, -1)}
                                disabled={getCartQuantity(item._id) <= 0}
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
                                max={item.stock}
                                value={getCartQuantity(item._id)}
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
                                  if (value >= 0 && value <= item.stock) {
                                    dispatch(
                                      updateCartItem({ productId: item._id, amount: value })
                                    ).unwrap().then(() => {
                                      dispatch(fetchCart());
                                    });
                                  }
                                }}
                              />
                              <Button
                                size="small"
                                onClick={() => handleQuantityChange(index, 1)}
                                disabled={getCartQuantity(item._id) >= item.stock}
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
                            </Space.Compact>
                          </div>
                          <Link to={`/edit/${item._id}`}>
                            <Button
                              style={{
                                fontSize: "12px",
                                width: "100%",
                              }}
                            >
                              Edit
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <Space.Compact style={{ width: "auto", display: "flex", alignItems: "stretch" }}>
                            <Button
                              size="small"
                              onClick={() => handleQuantityChange(index, -1)}
                              disabled={getCartQuantity(item._id) <= 0}
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
                              max={item.stock}
                              value={getCartQuantity(item._id)}
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
                                if (value >= 0 && value <= item.stock) {
                                  dispatch(
                                    updateCartItem({ productId: item._id, amount: value })
                                  ).unwrap().then(() => {
                                    dispatch(fetchCart());
                                  });
                                }
                              }}
                            />
                            <Button
                              size="small"
                              onClick={() => handleQuantityChange(index, 1)}
                              disabled={getCartQuantity(item._id) >= item.stock}
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
                          </Space.Compact>
                        </div>
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
    <>
      {contextHolder}
      <Content
        className="site-layout-background"
        style={{
          padding: "16px",
          margin: 0,
          minHeight: "calc(100vh - 64px)",
          overflow: "auto",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "16px",
            "@media (min-width: 768px)": {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }
          }}>
            <Text strong style={{ fontSize: "24px", marginBottom: "0" }}>
              Products
            </Text>
            <Flex 
              style={{ 
                gap: "8px",
                flexWrap: "wrap",
                justifyContent: "flex-end"
              }}
            >
              <Select
                value={sort}
                style={{ 
                  width: "160px",
                  minWidth: "140px"
                }}
                onChange={onSortChange}
                options={[
                  { value: "fromNew", label: "Last Added" },
                  { value: "fromLow", label: "Price: low to high" },
                  { value: "fromHigh", label: "Price: high to low" },
                ]}
              />
              {isAdmin && (
                <Link to={`/create`}>
                  <Button type="primary" size="middle">
                    Add Product
                  </Button>
                </Link>
              )}
            </Flex>
          </div>
        </div>
        <div>{list}</div>
      </Content>
    </>
  );
};

export default Product;
