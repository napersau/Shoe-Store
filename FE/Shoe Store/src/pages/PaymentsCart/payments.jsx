import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../../services/localStorageService";

const Payments = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { quantity, size, totalMoney, productId: stateProductId } = location.state || {};
  const [product, setProduct] = useState(null);
  const finalProductId = stateProductId || productId;
  const [paymentMethod, setPaymentMethod] = useState("Thanh toán khi nhận hàng");

  useEffect(() => {
    if (finalProductId) {
      fetch(`http://localhost:8080/products/client/${finalProductId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 1000 && data.result) {
            setProduct({
              name: data.result.name,
              image: data.result.image,
              price: data.result.price,
            });
          } else {
            console.error("Lỗi: Dữ liệu API không đúng định dạng");
          }
        })
        .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
    }
  }, [finalProductId]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    note: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVNPayPayment = async () => {
    try {
      // Lưu dữ liệu vào localStorage để sử dụng sau khi thanh toán
      localStorage.setItem("fullName", formData.fullName);
      localStorage.setItem("email", formData.email);
      localStorage.setItem("address", formData.address);
      localStorage.setItem("note", formData.note);
      localStorage.setItem("quantity", quantity);
      localStorage.setItem("totalMoney", totalMoney);
      localStorage.setItem("size", size);
  
      const response = await fetch(`http://localhost:8080/payment/vn-pay?amount=${totalMoney}&bankCode=NCB`);
      const data = await response.json();
  
      if (data.code === 200 && data.result.paymentUrl) {
        window.location.href = data.result.paymentUrl;
      } else {
        alert("Lỗi khi tạo thanh toán VNPay!");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán VNPay:", error);
      alert("Đã xảy ra lỗi khi xử lý thanh toán VNPay!");
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === "VNPay") {
      handleVNPayPayment();
      return;
    }

    const token = getToken();
    const orderData = {
      ...formData,
      numberOfProducts: quantity,
      totalMoney,
      size,
      paymentMethod,
      paymentStatus: "Chưa thanh toán",
    };

    try {
      const response = await fetch(`http://localhost:8080/order/${finalProductId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Không thể đặt hàng");
      alert("Đặt hàng thành công!");
      navigate("/order");
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Đã xảy ra lỗi khi đặt hàng!");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Thanh toán</h2>
      <div className="row">
        <div className="col-md-4">
          {product ? (
            <div className="card">
              <img src={product.image} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Giá: {product.price} VND</p>
                <p className="card-text">Số lượng: {quantity}</p>
                <p className="card-text">Size: {size}</p>
                <p className="card-text">Tổng tiền: {totalMoney} VND</p>
              </div>
            </div>
          ) : (
            <p>Đang tải thông tin sản phẩm...</p>
          )}
        </div>

        <div className="col-md-8">
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
              <label>Phương thức thanh toán</label>
              <select className="form-control" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="Thanh toán khi nhận hàng">Thanh toán khi nhận hàng</option>
                <option value="VNPay">VNPay</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success">Xác nhận thanh toán</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payments;
