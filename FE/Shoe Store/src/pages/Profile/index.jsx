import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Spin, message, Button, Form, Input } from "antd";
import { getToken } from "../../services/localStorageService";
import "./styles.css";

const { Title, Text } = Typography;

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserInfo();
  }, [navigate]);

  const fetchUserInfo = () => {
    setLoading(true);
    const token = getToken();
    fetch("http://localhost:8080/users/my-info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải thông tin người dùng!");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data.result);
        setUpdatedUser({
          fullName: data.result.fullName || "",
          address: data.result.address || "",
          phoneNumber: data.result.phoneNumber || "",
          dateOfBirth: data.result.dateOfBirth || "",
        });
        form.setFieldsValue({
          fullName: data.result.fullName || "",
          address: data.result.address || "",
          phoneNumber: data.result.phoneNumber || "",
          dateOfBirth: data.result.dateOfBirth || "",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        message.error(error.message);
        setLoading(false);
      });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    form.setFieldsValue({
      fullName: user.fullName || "",
      address: user.address || "",
      phoneNumber: user.phoneNumber || "",
      dateOfBirth: user.dateOfBirth || "",
    });
  };

  const handleUpdate = () => {
    const token = getToken();
    fetch(`http://localhost:8080/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Cập nhật thông tin thất bại!");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data.result);
        setEditing(false);
        message.success("Cập nhật thành công!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        message.error(error.message);
      });
  };

  const handleChange = (changedValues) => {
    setUpdatedUser({ ...updatedUser, ...changedValues });
  };

  const handlePasswordChange = (values) => {
    if (values.newPassword !== values.confirmNewPassword) {
      message.error("Mật khẩu mới không khớp!");
      return;
    }

    const token = getToken();
    fetch(`http://localhost:8080/users/password/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Đổi mật khẩu thất bại!");
        }
        return response.json();
      })
      .then(() => {
        message.success("Đổi mật khẩu thành công!");
        passwordForm.resetFields();
        setShowPasswordForm(false);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        message.error(error.message);
      });
  };

  return (
    <div className="profile-container">
      <Title level={2} className="profile-title">
        Thông tin cá nhân
      </Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Card className="profile-card">
          {editing ? (
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleChange}
              className="profile-form"
            >
              <Form.Item label="Họ và tên" name="fullName">
                <Input />
              </Form.Item>
              <Form.Item label="Địa chỉ" name="address">
                <Input />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phoneNumber">
                <Input />
              </Form.Item>
              <Form.Item label="Ngày sinh" name="dateOfBirth">
                <Input type="date" />
              </Form.Item>
              <div className="form-actions">
                <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                  Hủy
                </Button>
                <Button type="primary" onClick={handleUpdate}>
                  Cập nhật
                </Button>
              </div>
            </Form>
          ) : (
            <>
              <Text strong>Tên đăng nhập: </Text>
              <Text>{user?.username || "Chưa cập nhật"}</Text>
              <br />
              <Text strong>Họ và tên: </Text>
              <Text>{user?.fullName || "Chưa cập nhật"}</Text>
              <br />
              <Text strong>Địa chỉ: </Text>
              <Text>{user?.address || "Chưa cập nhật"}</Text>
              <br />
              <Text strong>Ngày sinh: </Text>
              <Text>{user?.dateOfBirth || "Chưa cập nhật"}</Text>
              <br />
              <Text strong>Số điện thoại: </Text>
              <Text>{user?.phoneNumber || "Chưa cập nhật"}</Text>
              <br />
              <Button
                type="primary"
                onClick={handleEdit}
                className="edit-button"
              >
                Chỉnh sửa thông tin
              </Button>
              <Button
                type="default"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                style={{ marginTop: 12, marginLeft: 12 }}
              >
                {showPasswordForm ? "Hủy đổi mật khẩu" : "Đổi mật khẩu"}
              </Button>

              {showPasswordForm && (
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handlePasswordChange}
                  className="password-form"
                  style={{ marginTop: 24 }}
                >
                  <Form.Item
                    label="Mật khẩu cũ"
                    name="oldPassword"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    label="Nhập lại mật khẩu mới"
                    name="confirmNewPassword"
                    rules={[{ required: true, message: "Vui lòng nhập lại mật khẩu mới" }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">
                    Xác nhận đổi mật khẩu
                  </Button>
                </Form>
              )}
            </>
          )}
        </Card>
      )}
    </div>
  );
}
