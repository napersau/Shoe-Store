import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import { Row, Col, Form, Input, Button, Radio, Spin, List, Typography, Alert, Image } from "antd";
import axios from "axios";
import "./styles.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

const PaymentsCart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalMoney } = location.state || {};
  const [cartDetails, setCartDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

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

  const handleSubmit = async (values) => {
    const token = getToken();

    if (!cartDetails || cartDetails.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    const orderData = {
      ...values,
      numberOfProducts: cartDetails.length,
      totalMoney,
      cartDetails,
      paymentStatus: "Đang chờ thanh toán",
    };

    try {
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
      localStorage.setItem("orderId", orderResult.result.id);

      // Gửi email xác nhận
      const emailContent = cartDetails.map((item, index) => (
        `\n${index + 1}. Sản phẩm: ${item.product.name}` +
        `\n   - Số lượng: ${item.numberOfProducts}` +
        `\n   - Size: ${item.size}` +
        `\n   - Giá: ${item.product.price.toLocaleString()} VNĐ`
      )).join("\n");

      const emailBody = `Cảm ơn bạn đã đặt hàng!\n\nThông tin đơn hàng:\n${emailContent}\n\nTổng tiền: ${totalMoney.toLocaleString()} VNĐ\n\nChúng tôi sẽ xử lý đơn hàng và liên hệ sớm nhất.`;

      try {
        await axios.post(
          "http://localhost:8080/order/email",
          {
            to: values.email,
            subject: "Xác nhận đơn hàng",
            text: emailBody,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Gửi mail thành công");
      } catch (emailError) {
        console.error("Lỗi khi gửi mail:", emailError);
      }

      // Nếu chọn VNPay
      if (values.paymentMethod === "VNPay - Cổng thanh toán điện tử") {
        const paymentResponse = await fetch(
          `http://localhost:8080/payment/vn-pay?amount=${totalMoney}&bankCode=NCB`
        );

        if (!paymentResponse.ok) {
          throw new Error("Không thể tạo thanh toán VNPay");
        }

        const paymentData = await paymentResponse.json();
        if (paymentData.code === 200 && paymentData.result.paymentUrl) {
          // Xoá giỏ hàng
          const deleteResponse = await fetch("http://localhost:8080/cart", {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!deleteResponse.ok) {
            throw new Error("Không thể xóa giỏ hàng sau khi tạo thanh toán VNPay");
          }

          window.location.href = paymentData.result.paymentUrl;
        } else {
          alert("Lỗi khi tạo thanh toán VNPay!");
        }
      } else {
        // Thanh toán khi nhận hàng
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
    <div className="payment-container">
      <Title level={2} className="payment-title">
        Thanh toán giỏ hàng
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Title level={4}>Giỏ hàng của bạn</Title>
          {loading ? (
            <Spin tip="Đang tải giỏ hàng..." />
          ) : error ? (
            <Alert message={error} type="error" showIcon />
          ) : cartDetails.length === 0 ? (
            <Text>Giỏ hàng trống</Text>
          ) : (
            <List
              dataSource={cartDetails}
              renderItem={(item, index) => (
                <List.Item className="cart-item">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <Text strong>{item.product.name}</Text>
                    <div className="cart-item-details">
                      <Text>Size: {item.size}</Text>
                      <Text>Số lượng: {item.numberOfProducts}</Text>
                    </div>
                    <Text>Giá: {item.product.price.toLocaleString()} VNĐ</Text>
                  </div>
                </List.Item>
              )}
            />
          )}
        </Col>

        <Col xs={24} md={12}>
          <Form
            form={form}
            onFinish={handleSubmit}
            initialValues={{
              paymentMethod: "Thanh toán khi nhận hàng",
            }}
            layout="vertical"
            className="payment-form"
          >
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" />
            </Form.Item>
            <Form.Item label="Tổng tiền">
              <Input value={totalMoney?.toLocaleString()} disabled />
            </Form.Item>
            <Form.Item label="Phương thức thanh toán" name="paymentMethod">
              <Radio.Group>
                <Radio value="Thanh toán khi nhận hàng">Thanh toán khi nhận hàng</Radio>
                <Radio value="VNPay - Cổng thanh toán điện tử">Thanh toán qua VNPay</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Xác nhận thanh toán
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentsCart;
