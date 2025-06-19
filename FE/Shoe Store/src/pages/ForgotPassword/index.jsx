import { Button, Form, Input, Typography, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Title } = Typography;

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: nhập email, 2: xác thực OTP, 3: nhập mật khẩu mới
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const showSuccess = (content) => {
    messageApi.success({ content, duration: 5 });
  };

  const showError = (content) => {
    messageApi.error({ content, duration: 5 });
  };

  const handleSendOtp = async (values) => {
    try {
      const response = await fetch(
        "http://localhost:8080/email/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gửi OTP thất bại");

      setEmail(values.email);
      setStep(2);
      showSuccess(data.result);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleVerifyOtp = async (values) => {
    try {
      const response = await fetch("http://localhost:8080/email/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: values.otp }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Xác thực OTP thất bại");

      setStep(3);
      showSuccess(data.result);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleResetPassword = async (values) => {
    try {
      const response = await fetch(
        "http://localhost:8080/email/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp: values.otp,
            newPassword: values.newPassword,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Đặt lại mật khẩu thất bại");

      showSuccess(data.result);
      form.resetFields();

      setTimeout(() => {
        navigate("/login");
      }, 1500); // Chờ 1.5s rồi chuyển về login
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <div className="login-container">
      {contextHolder}
      <Card className="login-card">
        <Title level={3}>Quên mật khẩu</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={
            step === 1
              ? handleSendOtp
              : step === 2
              ? handleVerifyOtp
              : handleResetPassword
          }
        >
          {step === 1 && (
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
          )}

          {step === 2 && (
            <Form.Item
              name="otp"
              label="Mã OTP"
              rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
            >
              <Input placeholder="Nhập mã OTP" />
            </Form.Item>
          )}

          {step === 3 && (
            <>
              <Form.Item
                name="otp"
                label="Mã OTP"
                rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
              >
                <Input placeholder="Nhập lại mã OTP" />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới" },
                ]}
              >
                <Input.Password placeholder="Mật khẩu mới" />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {step === 1
                ? "Gửi OTP"
                : step === 2
                ? "Xác nhận OTP"
                : "Đặt lại mật khẩu"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
