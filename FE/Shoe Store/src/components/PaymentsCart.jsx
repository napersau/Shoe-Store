import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./header_client/HeaderClient";
import { getToken } from "../services/localStorageService";

const PaymentsCart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận dữ liệu từ giỏ hàng
  const {totalMoney } = location.state || {};
  const [cartDetails, setCartDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    note: "",
    paymentMethod: "Thanh toán khi nhận hàng",
    paymentStatus: "Chưa thanh toán",
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
  
    const fetchCartDetails = async () => {
      try {
        const response = await fetch("http://localhost:8080/cart-detail", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu giỏ hàng");
        }
  
        const data = await response.json();
        setCartDetails(data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCartDetails(); // Gọi hàm để lấy dữ liệu
  }, [navigate]);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
  
    if (!cartDetails || cartDetails.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
  
    const orderData = {
      ...formData,
      numberOfProducts: cartDetails.length,
      totalMoney,
      cartDetails,
    };
  
    try {
      // Gửi yêu cầu đặt hàng
      const response = await fetch("http://localhost:8080/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể đặt hàng");
      }
  
      // Gửi yêu cầu xóa giỏ hàng
      const deleteResponse = await fetch("http://localhost:8080/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!deleteResponse.ok) {
        throw new Error("Không thể xóa giỏ hàng sau khi đặt hàng");
      }
  
      alert("Đặt hàng thành công! Giỏ hàng đã được xóa.");
      navigate("/order");
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert(`Lỗi khi đặt hàng: ${error.message}`);
    }
  };
  

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2>Thanh toán giỏ hàng</h2>
        <div className="row">
          {/* Danh sách sản phẩm trong giỏ hàng */}
          <div className="col-md-6">
            <h4>Giỏ hàng của bạn</h4>
            {loading ? (
              <p>Đang tải giỏ hàng...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : cartDetails.length === 0 ? (
              <p>Giỏ hàng trống</p>
            ) : (
                <ul className="list-group">
                    {cartDetails.map((item, index) => (
                        <li key={index} className="list-group-item">
                        <img src={item.product.image} alt={item.product.name} />
                        <div className="product-info">
                            <h6>{item.product.name}</h6>
                            <div className="product-details">
                            <span>Size: {item.size}</span>
                            <span>Số lượng: {item.numberOfProducts}</span>
                            </div>
                            <p>Giá: {item.product.price.toLocaleString()} VNĐ</p>
                        </div>
                        </li>
                    ))}
                    </ul>
            )}
          </div>

          {/* Form thanh toán */}
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Họ và tên</label>
                <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label>Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label>Địa chỉ</label>
                <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label>Ghi chú</label>
                <textarea className="form-control" name="note" value={formData.note} onChange={handleChange}></textarea>
              </div>
              <div className="mb-3">
                <label>Tổng tiền</label>
                <input type="number" className="form-control" value={totalMoney} readOnly />
              </div>
              <div className="mb-3">
                <label>Phương thức thanh toán</label>
                <input type="text" className="form-control" value={formData.paymentMethod} readOnly />
              </div>
              <div className="mb-3">
                <label>Trạng thái thanh toán</label>
                <input type="text" className="form-control" value={formData.paymentStatus} readOnly />
              </div>
              <button type="submit" className="btn btn-success">Xác nhận thanh toán</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentsCart;
