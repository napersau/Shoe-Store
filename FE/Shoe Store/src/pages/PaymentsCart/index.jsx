import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../../services/localStorageService";

const PaymentsCart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalMoney } = location.state || {};
  const [cartDetails, setCartDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    note: "",
    paymentMethod: "Thanh toán khi nhận hàng",
    // Đã xoá paymentStatus
  });

  useEffect(() => {
    const token = getToken();

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

    fetchCartDetails();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (e) => {
    setFormData({ ...formData, paymentMethod: e.target.value });
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
      paymentStatus: "Đang chờ thanh toán",
    };
  
    try {
      // Gửi đơn hàng trước
      const orderResponse = await fetch("http://localhost:8080/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
  
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || "Không thể tạo đơn hàng");
      }
  
      const orderResult = await orderResponse.json();
      localStorage.setItem("orderId", orderResult.result.id); // Lưu orderId nếu cần
  
      if (formData.paymentMethod === "VNPay - Cổng thanh toán điện tử") {
        // Tạo yêu cầu thanh toán VNPay sau khi đã có đơn hàng
        const paymentResponse = await fetch(
          `http://localhost:8080/payment/vn-pay?amount=${totalMoney}&bankCode=NCB`
        );
  
        if (!paymentResponse.ok) {
          throw new Error("Không thể tạo thanh toán VNPay");
        }
  
        const paymentData = await paymentResponse.json();
        if (paymentData.code === 200 && paymentData.result.paymentUrl) {
        // ✅ Xoá giỏ hàng trước khi chuyển hướng
        const deleteResponse = await fetch("http://localhost:8080/cart", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!deleteResponse.ok) {
          throw new Error("Không thể xóa giỏ hàng sau khi tạo thanh toán VNPay");
        }

          // ✅ Sau khi xóa giỏ hàng, chuyển hướng tới VNPay
          window.location.href = paymentData.result.paymentUrl;
        } else {
          alert("Lỗi khi tạo thanh toán VNPay!");
        }
      } else {
        // Xoá giỏ hàng sau khi đặt hàng (COD)
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
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert(`Lỗi khi đặt hàng: ${error.message}`);
    }
  };
  

  return (
    <div className="container mt-5">
      <h2>Thanh toán giỏ hàng</h2>
      <div className="row">
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
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="cod"
                  name="paymentMethod"
                  value="Thanh toán khi nhận hàng"
                  checked={formData.paymentMethod === "Thanh toán khi nhận hàng"}
                  onChange={handlePaymentMethodChange}
                />
                <label className="form-check-label" htmlFor="cod">
                  Thanh toán khi nhận hàng
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="vnpay"
                  name="paymentMethod"
                  value="VNPay - Cổng thanh toán điện tử"  // 🔄 Thay đổi giá trị ở đây
                  checked={formData.paymentMethod === "VNPay - Cổng thanh toán điện tử"}
                  onChange={handlePaymentMethodChange}
                />
                <label className="form-check-label" htmlFor="vnpay">
                  Thanh toán qua VNPay
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-success">Xác nhận thanh toán</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentsCart;
