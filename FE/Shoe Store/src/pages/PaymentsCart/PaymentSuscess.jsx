import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy dữ liệu lưu trong localStorage và gửi đơn hàng
    const orderData = {
      fullName: localStorage.getItem("fullName"),
      email: localStorage.getItem("email"),
      address: localStorage.getItem("address"),
      note: localStorage.getItem("note"),
      numberOfProducts: localStorage.getItem("quantity"),
      totalMoney: localStorage.getItem("totalMoney"),
      size: localStorage.getItem("size"),
      paymentMethod: "VNPay",
      paymentStatus: "Đã thanh toán",
    };

    fetch("http://localhost:8080/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
      .then((res) => res.json())
      .then(() => {
        // Xoá dữ liệu cũ
        localStorage.clear();
        navigate("/order");
      })
      .catch((err) => console.error("Lỗi khi tạo đơn hàng:", err));
  }, [navigate]);

  return <h2>Thanh toán thành công! Đang chuyển hướng...</h2>;
};

export default OrderSuccess;
