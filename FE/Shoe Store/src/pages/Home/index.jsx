import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Spin, Typography, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import "./styles.css";

const { Sider, Content } = Layout;
const { Title } = Typography;

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [navigate]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Main Content */}
      <Layout>
        <Content className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Typography.Text>Loading ...</Typography.Text>
            </div>
          ) : (
            <div className="button-container">
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/admin/products")}
              >
                Quản lý sản phẩm
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/admin/order")}
                style={{ background: "#fa541c", borderColor: "#fa541c" }}
              >
                Quản lý đơn hàng
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/admin/accounts")}
                style={{ background: "#52c41a", borderColor: "#52c41a" }}
              >
                Quản lý tài khoản
              </Button>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}