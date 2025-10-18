import { Layout, Typography, Row, Col } from "antd";
const { Content } = Layout;
const { Title } = Typography;
import ProductForm from "../components/ProductForm";

const Create = () => {
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
      <Title level={2}>Create Product</Title>
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

export default Create;
