import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Spin, message, Button, Form, Input } from "antd";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import "./styles.css";

const { Title, Text } = Typography;

// Axios config
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const API_BASE = "http://localhost:8080";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    if (!getToken()) return navigate("/login");
    fetchUserInfo();
  }, [navigate]);

  const fetchUserInfo = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/users/my-info`);
      setUser(data.result);
      form.setFieldsValue(data.result);
    } catch (error) {
      message.error("Không thể tải thông tin người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const { data } = await axios.put(`${API_BASE}/users/${user.id}`, values);
      setUser(data.result);
      setEditing(false);
      message.success("Cập nhật thành công!");
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      message.error("Cập nhật thất bại!");
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      await axios.put(`${API_BASE}/users/password/${user.id}`, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields();
      setShowPasswordForm(false);
    } catch (error) {
      message.error("Đổi mật khẩu thất bại!");
    }
  };

  const userFields = [
    { label: "Tên đăng nhập", key: "username" },
    { label: "Họ và tên", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Địa chỉ", key: "address" },
    { label: "Ngày sinh", key: "dateOfBirth" },
    { label: "Số điện thoại", key: "phoneNumber" },
  ];

  const formFields = [
    { name: "fullName", label: "Họ và tên", required: true },
    { name: "email", label: "Email", required: true, type: "email" },
    { name: "address", label: "Địa chỉ" },
    { name: "phoneNumber", label: "Số điện thoại", pattern: /^[0-9]{10,11}$/ },
    { name: "dateOfBirth", label: "Ngày sinh", type: "date" },
  ];

  if (loading) return <div className="profile-loading"><Spin size="large" /></div>;

  return (
    <div className="profile-container" style={{marginTop:80}}>
      <Title level={2} className="profile-title">Thông tin cá nhân</Title>
      
      <Card className="profile-card">
        {editing ? (
          <Form form={form} layout="vertical" onFinish={handleUpdate} className="profile-form">
            {formFields.map(field => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={[
                  field.required && { required: true, message: `Vui lòng nhập ${field.label.toLowerCase()}` },
                  field.type === "email" && { type: "email", message: "Email không hợp lệ" },
                  field.pattern && { pattern: field.pattern, message: "Số điện thoại phải có 10-11 chữ số" }
                ].filter(Boolean)}
              >
                <Input type={field.type || "text"} />
              </Form.Item>
            ))}
            <div className="form-actions">
              <Button onClick={() => setEditing(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">Cập nhật</Button>
            </div>
          </Form>
        ) : (
          <div className="profile-info">
            {userFields.map(field => (
              <div key={field.key} className="info-row">
                <Text strong>{field.label}: </Text>
                <Text>{user?.[field.key] || "Chưa cập nhật"}</Text>
              </div>
            ))}
            
            <div className="profile-actions">
              <Button type="primary" onClick={() => setEditing(true)}>
                Chỉnh sửa thông tin
              </Button>
              <Button onClick={() => setShowPasswordForm(!showPasswordForm)}>
                {showPasswordForm ? "Hủy đổi mật khẩu" : "Đổi mật khẩu"}
              </Button>
            </div>

            {showPasswordForm && (
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handlePasswordChange}
                className="password-form"
              >
                <Form.Item
                  name="oldPassword"
                  label="Mật khẩu cũ"
                  rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="Mật khẩu mới"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu mới" },
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="confirmNewPassword"
                  label="Nhập lại mật khẩu mới"
                  rules={[
                    { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  Xác nhận đổi mật khẩu
                </Button>
              </Form>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}