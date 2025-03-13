/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../../services/localStorageService";
import { jwtDecode } from "jwt-decode";


import "../../assets/css/bootstrap.min.css";
import "../../assets/css/templatemo.css";
import "../../assets/css/custom.css";

const HeaderClient = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      checkTokenValidity(token);
      extractUserRole(token);
    }
    setIsLoggedIn(!!token);
  }, []);

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

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      {showAlert && (
        <div className="alert alert-warning position-fixed top-0 end-0 m-3" role="alert">
          Bạn cần đăng nhập để vào giỏ hàng!
        </div>
      )}
      <nav className="navbar navbar-expand-lg navbar-light shadow">
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand text-success logo h1 align-self-center" to="/home">
            Zay
          </Link>

          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#templatemo_main_nav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse flex-fill d-lg-flex justify-content-lg-between" id="templatemo_main_nav">
            <ul className="nav navbar-nav d-flex justify-content-between mx-lg-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/home">Trang chủ</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/shop">Shop</Link>
              </li>
            </ul>

            <div className="navbar align-self-center d-flex">
              <Link
                className="nav-icon position-relative text-decoration-none me-3"
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
                <i className="fa-solid fa-box text-dark"></i>
              </Link>

              <Link
                className="nav-icon position-relative text-decoration-none"
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
                <i className="fa fa-fw fa-cart-arrow-down text-dark mr-1"></i>
              </Link>

              {/* Dropdown tài khoản */}
              <div className="nav-item dropdown">
                <a className="nav-link top-nav-link" href="/" id="accountDropdown" role="button" data-bs-toggle="dropdown">
                  <i className="fa-solid fa-user"></i>
                </a>
                <ul className="dropdown-menu" aria-labelledby="accountDropdown">
                  {isLoggedIn ? (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/profile">Xem thông tin</Link>
                      </li>
                      {isAdmin && (
                        <li>
                          <Link className="dropdown-item" to="/admin">Trang quản trị</Link>
                        </li>
                      )}
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/login">Đăng nhập</Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/register">Đăng ký</Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default HeaderClient;
