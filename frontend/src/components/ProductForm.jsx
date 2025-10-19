import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Space,
  Button,
  Typography,
  Image,
  message,
} from "antd";
import { FileImageOutlined } from "@ant-design/icons";
const { Text } = Typography;
import { fetchDetailById } from "../feature/product/detailSlice";

const ProductForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
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
    console.log(value);
    console.log(token);
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
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    }).then((response) => {
      if (!response.ok) {
        messageApi.error("Submit error");
      } else {
        messageApi.success("Submit success");
      }
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
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Product Description"
            name="description"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input.TextArea rows={4} />
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
            <Form.Item label="Price" name="price">
              <Input addonBefore="$" />
            </Form.Item>
          </div>
          <div style={{ display: "flex", width: "100%", gap: "8px" }}>
            <Form.Item
              label="In Stock Quantity"
              name="stock"
              rules={[
                { pattern: new RegExp(/^[0-9]+$/), message: "Input not valid" },
                { required: true, message: "This field is required" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Add Image Link"
              name="image"
              rules={[
                { type: "url", message: "Input not valid" },
                { required: true, message: "This field is required" },
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
            <Button type="primary" htmlType="submit">
              Add Product
            </Button>
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
