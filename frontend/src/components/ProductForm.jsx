import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Space,
  Button,
  Typography,
  Image,
  message,
  Modal,
} from "antd";
import { FileImageOutlined } from "@ant-design/icons";
const { Text } = Typography;
import { fetchDetailById } from "../feature/product/detailSlice";
import { fetchAll } from "../feature/product/productSlice";

const ProductForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageLink, setImageLink] = useState("");
  const inputRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const token = useSelector((state) => state.auth.token);

  let status, detail, name, description, category, price, stock, image;
  if (id === undefined) {
    // No ID, create page
    name, description, price, stock, (image = "");
    category = "PC";
  } else {
    // Edit page, API call
    detail = useSelector((state) => state.detail.data);
    status = useSelector((state) => state.detail.status);
    if (status === "succeeded") {
      // Load for form initial value
      name = detail.productName;
      description = detail.description;
      category = detail.category;
      price = detail.price;
      stock = detail.stock;
      image = detail.image;
    }
  }

  useEffect(() => {
    if (id !== undefined && status === "idle") {
      dispatch(fetchDetailById(id));
    }
    if (id !== undefined && status === "succeeded") {
      if (id !== detail._id) {
        // Do API call again to clear old data
        dispatch(fetchDetailById(id));
      }
    }
  }, [status, dispatch, id]);

  const submit = async (value) => {
    value.price = parseInt(value.price);
    value.stock = parseInt(value.stock);
    let apiUrl, method;
    if (id !== undefined) {
      apiUrl = `http://localhost:3000/api/product/${id}`;
      method = "PUT";
    } else {
      apiUrl = `http://localhost:3000/api/product/`;
      method = "POST";
    }
    fetch(apiUrl, {
      method: method,
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    }).then((response) => {
      if (!response.ok) {
        messageApi.error("Submit error");
      } else {
        if (id !== undefined) {
          messageApi
            .success("Submit success", 3)
            .then(dispatch(fetchDetailById(id)))
            .then(navigate(`/product/${id}`));
        } else {
          messageApi
            .success("Submit success", 3)
            .then(dispatch(fetchAll({ sort: "fromNew", page: 1 })))
            .then(navigate("/home?sort=fromNew&page=1"));
        }
      }
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Product",
      content: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/product/${id}`, {
            method: "DELETE",
            headers: {
              "x-auth-token": token,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const result = await response.json();
            messageApi.success(result.message || "Product deleted successfully");
            dispatch(fetchAll({ sort: "fromNew", page: 1 }));
            navigate("/home");
          } else {
            const errorData = await response.json();
            let errorMessage = "Failed to delete product";
            
            if (response.status === 401) {
              errorMessage = "Please sign in to delete products";
            } else if (response.status === 403) {
              errorMessage = "You don't have permission to delete this product";
            } else if (response.status === 404) {
              errorMessage = "Product not found";
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
            
            messageApi.error(errorMessage);
          }
        } catch (error) {
          console.error("Delete error:", error);
          messageApi.error("Network error. Please try again.");
        }
      },
    });
  };

  // Image preview area
  let imageArea;
  // Default
  if (imageLink === "") {
    imageArea = (
      <>
        <div
          style={{
            borderRadius: "25px",
            border: "2px dashed #aaa",
            height: "200px",
          }}
        >
          <div
            style={{
              position: "relative",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <FileImageOutlined style={{ fontSize: "24px", color: "#ccc" }} />
            <br />
            <Text style={{ fontSize: "12px", color: "#ccc" }}>
              Image preview!
            </Text>
          </div>
        </div>
      </>
    );
  } else {
    // Image loaded
    imageArea = (
      <>
        <div style={{ textAlign: "center" }}>
          <Image
            width={200}
            src={imageLink}
            fallback="https://demofree.sirv.com/nope-not-here.jpg?w=150"
          />
        </div>
      </>
    );
  }

  // If ID provided (edit page), only load initial value after API call succeeded
  if (id === undefined || status === "succeeded") {
    return (
      <>
        {contextHolder}
        <Form
          name="product"
          layout="vertical"
          initialValues={{
            productName: name,
            description: description,
            category: category,
            price: price,
            stock: stock,
          }}
          onFinish={submit}
          onFinishFailed={() => {
            messageApi.error("Submit error");
          }}
        >
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[
              { required: true, message: "Please enter the product name" },
              { min: 2, message: "Product name must be at least 2 characters" },
              { max: 100, message: "Product name cannot exceed 100 characters" },
              { 
                pattern: /^[a-zA-Z0-9\s\-_]+$/, 
                message: "No special characters except hyphens and underscores" 
              }
            ]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item
            label="Product Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the product description" },
              { min: 10, message: "Description must be at least 10 characters" },
              { max: 1000, message: "Description cannot exceed 1000 characters" }
            ]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Describe your product in detail..."
              showCount
              maxLength={1000}
            />
          </Form.Item>
          <div style={{ display: "flex", width: "100%", gap: "8px" }}>
            <Form.Item label="Category" name="category">
              <Select>
                <Select.Option value="PC">PC</Select.Option>
                <Select.Option value="Laptop">Laptop</Select.Option>
                <Select.Option value="Tablet">Tablet</Select.Option>
                <Select.Option value="Phone">Phone</Select.Option>
                <Select.Option value="Watch">Watch</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item 
              label="Price" 
              name="price"
              rules={[
                { required: true, message: "Please enter the product price" },
                { 
                  pattern: /^\d+(\.\d{1,2})?$/, 
                  message: "Enter a valid price (e.g., 19.99)" 
                },
                { 
                  validator: (_, value) => {
                    const num = parseFloat(value);
                    if (num <= 0) {
                      return Promise.reject(new Error("Price must be greater than 0"));
                    }
                    if (num > 999999) {
                      return Promise.reject(new Error("Price cannot exceed $999,999"));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input addonBefore="$" placeholder="0.00" />
            </Form.Item>
          </div>
          <div style={{ display: "flex", width: "100%", gap: "8px" }}>
            <Form.Item
              label="In Stock Quantity"
              name="stock"
              rules={[
                { required: true, message: "Please enter the stock quantity" },
                { pattern: /^\d+$/, message: "Enter a valid number" },
                { 
                  validator: (_, value) => {
                    const num = parseInt(value);
                    if (num < 0) {
                      return Promise.reject(new Error("Stock cannot be negative"));
                    }
                    if (num > 999999) {
                      return Promise.reject(new Error("Stock cannot exceed 999,999"));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input placeholder="0" />
            </Form.Item>
            <Form.Item
              label="Add Image Link"
              name="image"
              rules={[
                { type: "url", message: "Enter a valid URL (e.g., https://example.com/image.jpg)" }
              ]}
            >
              <Space.Compact block>
                <Input defaultValue={image} ref={inputRef} />
                <Button
                  type="primary"
                  onClick={() => setImageLink(inputRef.current.input.value)}
                >
                  Preview
                </Button>
              </Space.Compact>
            </Form.Item>
          </div>
          {imageArea}
          <br />
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {id === undefined ? "Add Product" : "Edit Product"}
              </Button>
              {id !== undefined && (
                <Button type="primary" danger onClick={handleDelete}>
                  Delete Product
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </>
    );
  } else if (status === "loading") {
    return "Loading...";
  } else if (status === "failed") {
    return "Internal Server Error";
  }
};

export default ProductForm;
