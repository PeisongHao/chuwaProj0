import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form, Input, Select, Space, Button, Typography, Image } from "antd";
import { FileImageOutlined } from "@ant-design/icons";
const { Text } = Typography;
import { fetchDetailById } from "../feature/product/detailSlice";

const ProductForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [imageLink, setImageLink] = useState("");
  const inputRef = useRef(null);

  let status, detail, name, description, category, price, stock, image;
  if (id === undefined) {
    // No ID, create page
    name, description, price, stock, (image = "");
    category = "Category1";
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
  }, [status, dispatch, id]);

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
      >
        <Form.Item
          label="Product Name"
          name="productName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Product Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <div style={{ display: "flex", width: "100%", gap: "8px" }}>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="Category1">Category1</Select.Option>
              <Select.Option value="Category2">Category2</Select.Option>
              <Select.Option value="Category3">Category3</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </div>
        <div style={{ display: "flex", width: "100%", gap: "8px" }}>
          <Form.Item
            label="In Stock Quantity"
            name="stock"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Add Image Link"
            name="image"
            rules={[{ required: true }]}
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
    );
  } else if (status === "loading") {
    return "Loading...";
  } else if (status === "failed") {
    return "Internal Server Error";
  }
};

export default ProductForm;
