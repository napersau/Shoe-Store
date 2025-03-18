import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../../services/localStorageService";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getToken();
    const orderId = localStorage.getItem("orderId"); // ✅ Lấy từ localStorage
  
    if (!orderId) {
      alert("Không tìm thấy đơn hàng!");
      navigate("/");
      return;
    }
  
    fetch(`http://localhost:8080/payment/vn-pay-callback${location.search}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.code === 200) {
          try {
            const updateResponse = await fetch(`http://localhost:8080/order/${orderId}/update-payment`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
  
            if (!updateResponse.ok) throw new Error("Không thể cập nhật đơn hàng!");
  
            localStorage.removeItem("orderId"); // ✅ Dọn dẹp sau khi cập nhật
            alert("Thanh toán thành công! Đơn hàng đã được cập nhật.");
            navigate("/order");
          } catch (err) {
            console.error("Lỗi cập nhật đơn hàng:", err);
            alert("Lỗi khi cập nhật đơn hàng!");
          }
        } else {
          try {
            const deleteResponse = await fetch(`http://localhost:8080/order/${orderId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
  
            if (!deleteResponse.ok) throw new Error("Không thể xóa đơn hàng!");
  
            localStorage.removeItem("orderId"); // ✅ Dọn dẹp sau khi xóa
            alert("Thanh toán thất bại! Đơn hàng đã bị hủy.");
            navigate("/");
          } catch (err) {
            console.error("Lỗi xóa đơn hàng:", err);
            alert("Không thể xóa đơn hàng thất bại!");
            navigate("/");
          }
        }
      })
      .catch((err) => {
        console.error("Lỗi callback VNPay:", err);
        alert("Lỗi khi xử lý thanh toán!");
        navigate("/");
      });
  }, [location, navigate]);
  

  return <h2>Đang xử lý đơn hàng sau thanh toán...</h2>;
};

export default OrderSuccess;
