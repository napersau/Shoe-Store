import { Outlet, useLocation } from "react-router-dom";
import Footer from "../../components/Footer";
import HeaderClient from "../../components/HeaderClient"
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Content } from "antd/es/layout/layout";
import './sider.css';
import MenuSider from "../../components/Sidebar/index";
import { useState } from "react";
import { getToken } from "../../services/localStorageService";
import { jwtDecode } from "jwt-decode";

function LayoutDefault() {
    const location = useLocation();
    const token = getToken();
    const [collapsed, setCollapsed] = useState(true);
    let userRole = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded.scope?.name || null;
        } catch (error) {
            console.error("Lỗi giải mã token:", error);
        }
    }

    const isAdminPage = location.pathname.startsWith("/admin");

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {userRole === "ADMIN" && isAdminPage && (
                <Sider collapsed={collapsed} theme="light" className="sider" width={250}>
                    <div className="header__collapse" style={{marginTop:30}} onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </div>
                    <MenuSider />
                </Sider>
            )}
            <Layout>
                <HeaderClient />
                <Content style={{ margin: "20px", padding: "20px" }}>
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: "center" }}>Footer</Footer>
            </Layout>
        </Layout>
    );
}

export default LayoutDefault;