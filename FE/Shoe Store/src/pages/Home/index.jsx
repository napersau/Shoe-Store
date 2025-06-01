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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { key: "1", label: "Quản lý sản phẩm", path: "/admin/products" },
    { key: "2", label: "Quản lý đơn hàng", path: "/admin/order" },
    { key: "3", label: "Quản lý tài khoản", path: "/accounts" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        placement="left"
        closable={false}
        onClose={toggleSidebar}
        visible={isSidebarOpen}
        width={250}
        bodyStyle={{ padding: 0 }}
        className="sidebar-drawer"
      >
        <div className="sidebar-header">
          <Title level={4} className="sidebar-title">
            Shoe Store
          </Title>
        </div>
        <Menu
          mode="inline"
          items={menuItems}
          onClick={({ key }) => {
            const item = menuItems.find((i) => i.key === key);
            navigate(item.path);
            setIsSidebarOpen(false);
          }}
        />
      </Drawer>

      <Sider
        width={70}
        className="sidebar-collapsed"
        style={{ display: isSidebarOpen ? "none" : "block" }}
      >
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={toggleSidebar}
          className="menu-toggle-button"
        />
      </Sider>

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