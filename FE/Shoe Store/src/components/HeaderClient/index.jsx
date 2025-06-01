import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../../services/localStorageService";
import { jwtDecode } from "jwt-decode";
import { Menu, Button, Dropdown, Alert, Space } from "antd";
import { HomeOutlined, ShopOutlined, UserOutlined, ShoppingCartOutlined, ShoppingOutlined } from "@ant-design/icons";
import "./styles.css";

// Component Header cho giao diện client
const HeaderClient = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Kiểm tra token khi component được mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      checkTokenValidity(token);
      extractUserRole(token);
    }
    setIsLoggedIn(!!token);
  }, []);

  // Xử lý sự kiện cuộn để thu nhỏ header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hàm kiểm tra tính hợp lệ của token
  const checkTokenValidity = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/auth/introspect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.code === 1000 && data.result.valid) {
        setIsLoggedIn(true);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Lỗi kiểm tra token:", error);
      handleLogout();
    }
  };

  // Hàm lấy vai trò người dùng từ token
  const extractUserRole = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.scope?.name === "ADMIN") {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
    }
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
    window.location.reload();
  };

  // Menu cho dropdown tài khoản
  const accountMenu = (
    <Menu>
      {isLoggedIn ? (
        <>
          <Menu.Item key="profile">
            <Link to="/profile">Xem thông tin</Link>
          </Menu.Item>
          {isAdmin && (
            <Menu.Item key="admin">
              <Link to="/admin">Trang quản trị</Link>
            </Menu.Item>
          )}
          <Menu.Item key="logout">
            <Button type="text" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item key="login">
            <Link to="/login">Đăng nhập</Link>
          </Menu.Item>
          <Menu.Item key="register">
            <Link to="/register">Đăng ký</Link>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <>
      {showAlert && (
        <Alert
          message="Bạn cần đăng nhập để vào giỏ hàng!"
          type="warning"
          showIcon
          className="custom-alert"
          closable
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className={`header-container ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-content">
          <div className="logo">
            <Link to="/home">Zay</Link>
          </div>
          <Menu mode="horizontal" className="main-menu" style={{ marginTop: '10px', marginBottom: '10px' }}>
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <Link to="/home">Trang chủ</Link>
            </Menu.Item>
            <Menu.Item key="shop" icon={<ShopOutlined />}>
              <Link to="/shop">Shop</Link>
            </Menu.Item>
          </Menu>
          <Space className="nav-actions" size="large">
            <Link
              to={isLoggedIn ? "/order" : "#"}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  setShowAlert(true);
                  setTimeout(() => setShowAlert(false), 3000);
                  navigate("/login");
                }
              }}
            >
              <Button icon={<ShoppingOutlined />} type="text" className="nav-button" />
            </Link>
            <Link
              to={isLoggedIn ? "/cart" : "#"}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  setShowAlert(true);
                  setTimeout(() => setShowAlert(false), 3000);
                  navigate("/login");
                }
              }}
            >
              <Button icon={<ShoppingCartOutlined />} type="text" className="nav-button" />
            </Link>
            <Dropdown overlay={accountMenu} trigger={["click"]}>
              <Button icon={<UserOutlined />} type="text" className="nav-button" />
            </Dropdown>
          </Space>
        </div>
      </div>
    </>
  );
};

export default HeaderClient;