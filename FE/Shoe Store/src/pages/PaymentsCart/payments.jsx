import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Radio,
  Card,
  Typography,
  Spin,
  Alert,
  Image,
} from "antd";
import "./styles.css";
import axios from "axios";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Payments = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    quantity,
    size,
    totalMoney,
    productId: stateProductId,
  } = location.state || {};
  const finalProductId = stateProductId || productId;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (finalProductId) {
      setLoading(true);
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
            setError("Dữ liệu API không đúng định dạng");
          }
        })
        .catch((err) => setError("Lỗi khi lấy sản phẩm: " + err.message))
        .finally(() => setLoading(false));
    }
  }, [finalProductId]);

  const handleSubmit = async (values) => {
    const token = getToken();
    const orderData = {
      ...values,
      numberOfProducts: quantity,
      totalMoney,
      size,
      paymentMethod: values.paymentMethod,
      paymentStatus:
        values.paymentMethod === "Thanh toán khi nhận hàng"
          ? "Chưa thanh toán"
          : "Đang chờ thanh toán",
    };

    try {
      const orderResponse = await fetch(
        `http://localhost:8080/order/${finalProductId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Không thể tạo đơn hàng");
      }

      const orderResult = await orderResponse.json();
      localStorage.setItem("orderId", orderResult.result.id);

      // Gửi mail xác nhận đặt hàng
      try {
        await axios.post(
          "http://localhost:8080/order/email",
          {
            to: values.email,
            subject: "Xác nhận đơn hàng",
            text: `Cảm ơn bạn đã đặt hàng!\n\nThông tin đơn hàng:\n- Sản phẩm: ${
              product.name
            }\n- Số lượng: ${quantity}\n- Size: ${size}\n- Tổng tiền: ${totalMoney.toLocaleString()} VNĐ\n\nChúng tôi sẽ xử lý đơn hàng và liên hệ sớm nhất.`,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Gửi mail thành công");
      } catch (error) {
        console.error("Lỗi khi gửi mail:", error);
      }

      if (values.paymentMethod === "VNPay - Cổng thanh toán điện tử") {
        const paymentResponse = await fetch(
          `http://localhost:8080/payment/vn-pay?amount=${totalMoney}&bankCode=NCB`
        );

        if (!paymentResponse.ok) {
          throw new Error("Không thể tạo thanh toán VNPay");
        }

        const paymentData = await paymentResponse.json();
        if (paymentData.code === 200 && paymentData.result.paymentUrl) {
          window.location.href = paymentData.result.paymentUrl;
        } else {
          alert("Lỗi khi tạo thanh toán VNPay!");
        }
      } else {
        alert("Đặt hàng thành công!");
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
        Thanh toán
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          {loading ? (
            <Spin tip="Đang tải thông tin sản phẩm..." />
          ) : error ? (
            <Alert message={error} type="error" showIcon />
          ) : product ? (
            <Card className="product-card">
              <Image
                src={product.image}
                alt={product.name}
                className="product-image"
                width="100%"
                height={200}
                style={{ objectFit: "cover" }}
              />
              <div className="product-info">
                <Title level={5}>{product.name}</Title>
                <Text>Giá: {product.price.toLocaleString()} VNĐ</Text>
                <br />
                <Text>Số lượng: {quantity}</Text>
                <br />
                <Text>Size: {size}</Text>
                <br />
                <Text strong>Tổng tiền: {totalMoney.toLocaleString()} VNĐ</Text>
              </div>
            </Card>
          ) : (
            <Text>Không tìm thấy thông tin sản phẩm</Text>
          )}
        </Col>

        <Col xs={24} md={16}>
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
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Vui lòng nhập email hợp lệ",
                },
              ]}
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
            <Form.Item label="Phương thức thanh toán" name="paymentMethod">
              <Radio.Group>
                <Radio value="Thanh toán khi nhận hàng">
                  Thanh toán khi nhận hàng
                </Radio>
                <Radio value="VNPay - Cổng thanh toán điện tử">
                  Thanh toán qua VNPay
                </Radio>
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

export default Payments;
