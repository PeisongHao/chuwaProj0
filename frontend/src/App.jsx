import "./App.css";
import React from "react";
import { Layout } from "antd";
const { Content } = Layout;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PageHeader from "./components/PageHeader";
import PageFooter from "./components/PageFooter";
import Product from "./pages/Product";
import Detail from "./pages/Detail";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import UpdatePassword from "./pages/UpdatePassword";

function App() {
  return (
    <>
      <Router>
        <Layout>
          <PageHeader />
          <Content style={{ padding: "0 48px" }}>
            <Routes>
              <Route path="/" element={<Product />} />
              <Route path="/product/:id" element={<Detail />} />
              <Route path="/create" element={<Create />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/:email" element={<UpdatePassword />} />
            </Routes>
          </Content>
          <PageFooter />
        </Layout>
      </Router>
    </>
  );
}

export default App;
