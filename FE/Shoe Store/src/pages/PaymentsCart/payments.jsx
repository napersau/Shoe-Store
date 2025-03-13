import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../../services/localStorageService";

const Payments = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận dữ liệu từ ProductDetails
  const { quantity, size, totalMoney, productId: stateProductId } = location.state || {};

  const [product, setProduct] = useState(null);

  // Kiểm tra productId có từ state hay không
  const finalProductId = stateProductId || productId;

  useEffect(() => {
    if (finalProductId) {
      fetch(`http://localhost:8080/products/client/${finalProductId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 1000 && data.result) {
            setProduct({
              name: data.result.name,
              image: data.result.image, // Kiểm tra lại đường dẫn ảnh
              price: data.result.price, // Thêm giá vào dữ liệu sản phẩm
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
    paymentMethod: "Thanh toán khi nhận hàng",
    paymentStatus: "Chưa thanh toán",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    const orderData = {
      ...formData,
      numberOfProducts: quantity,
      totalMoney,
      size,
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
    <>
      <div className="container mt-5">
        <h2>Thanh toán</h2>
        <div className="row">
          {/* Hiển thị sản phẩm bên trái */}
          <div className="col-md-4">
            {product ? (
              <div className="card">
                <img src={product.image} className="card-img-top" alt={product.name} />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Giá: {product.price} VND</p>
                  <div className="row">
                    <div className="col-6">
                      <p className="card-text">Số lượng: {quantity}</p>
                    </div>
                    <div className="col-6">
                      <p className="card-text">Size: {size}</p>
                    </div>
                  </div>
                  <p className="card-text">Tổng tiền: {totalMoney} VND</p>
                </div>
              </div>
            ) : (
              <p>Đang tải thông tin sản phẩm...</p>
            )}
          </div>

          {/* Form thanh toán bên phải */}
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

export default Payments;
