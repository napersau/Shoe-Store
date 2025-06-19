import { Button, Card, Divider, Form, Input, Typography, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../services/localStorageService";
import "./styles.css";

const { Title } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const showError = (content) => {
    messageApi.open({
      type: "error",
      content,
      duration: 6,
    });
  };

  const handleGoogleLogin = async () => {
    try {
      window.location.href =
        "http://localhost:8080/oauth2/authorization/google";
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      showError(error.message);
    }
  };

  const onFinish = async (values) => {
    try {
      const response = await fetch("http://localhost:8080/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();
      console.log("Response body:", data);

      if (data.code !== 1000) {
        throw new Error("Tên đăng nhập hoặc mật khẩu không đúng!");
      }

      setToken(data.result?.token);
      navigate("/home");
      window.location.reload();
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="login-container">
        <Card className="login-card">
          <Title level={3} className="login-title">
            Đăng nhập
          </Title>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            className="login-form"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
            >
              <Input placeholder="Tài khoản" size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password placeholder="Mật khẩu" size="large" />
            </Form.Item>
            <Form.Item>
              <Button
                type="link"
                onClick={() => navigate("/forgot-password")}
                className="forgot-password-link"
              >
                Quên mật khẩu?
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="login-button"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <Button
            size="large"
            block
            icon={<GoogleOutlined />}
            onClick={handleGoogleLogin}
            className="google-button"
          >
            Đăng nhập bằng Google
          </Button>
          <Button
            size="large"
            block
            type="default"
            onClick={() =>
              (window.location.href = "http://localhost:3000/register")
            }
            className="register-button"
          >
            Tạo tài khoản
          </Button>
        </Card>
      </div>
    </>
  );
}
