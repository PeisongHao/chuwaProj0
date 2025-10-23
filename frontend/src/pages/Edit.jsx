import { Layout, Typography, Row, Col } from "antd";
const { Content } = Layout;
const { Title } = Typography;
import ProductForm from "../components/ProductForm";

const Edit = () => {
  return (
    <Content
      className="site-layout-background"
      style={{
        padding: "16px",
        margin: 0,
        minHeight: "calc(100vh - 64px)",
        overflow: "auto",
      }}
    >
      <Title level={2} style={{ marginBottom: "24px" }}>Edit Product</Title>
      <Row justify="center">
        <Col
          xs={24}
          sm={20}
          md={16}
          lg={12}
          xl={10}
          style={{ 
            backgroundColor: "#fff", 
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <ProductForm />
        </Col>
      </Row>
    </Content>
  );
};

export default Edit;
