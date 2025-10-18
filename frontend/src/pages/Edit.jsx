import { Layout, Typography, Row, Col } from "antd";
const { Content } = Layout;
const { Title } = Typography;
import ProductForm from "../components/ProductForm";

const Edit = () => {
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
      <Title level={2}>Edit Product</Title>
      <Row>
        <Col
          span={12}
          offset={6}
          style={{ backgroundColor: "#fff", padding: 24 }}
        >
          <ProductForm />
        </Col>
      </Row>
    </Content>
  );
};

export default Edit;
