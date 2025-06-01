// src/components/OrderAdmin.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Table,
  Button,
  Spin,
  message,
  Typography,
  Select,
  Space,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { getToken } from "../../services/localStorageService";
import "./styles.css"; // Import the custom CSS file

const { Title } = Typography;
const { Option } = Select;

export default function OrderAdmin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [updatedOrders, setUpdatedOrders] = useState({});
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = () => {
    setLoading(true);
    const token = getToken();
    fetch("http://localhost:8080/order/manager", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải danh sách đơn hàng!");
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        setError(error.message);
        setLoading(false);
        message.error(error.message);
      });
  };

  const handleEdit = (order) => {
    setEditingOrder(order.id);
    setUpdatedOrders({
      id: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
    });
  };

  const handleUpdate = () => {
    const token = getToken();
    fetch(`http://localhost:8080/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedOrders),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể cập nhật đơn hàng!");
        }
        return response.json();
      })
      .then(() => {
        setEditingOrder(null);
        fetchOrders();
        message.success("Cập nhật đơn hàng thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật đơn hàng:", error);
        setError(error.message);
        message.error(error.message);
      });
  };

  const handleChange = (field, value) => {
    setUpdatedOrders((prev) => ({ ...prev, [field]: value }));
  };

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (totalMoney) => `${totalMoney.toLocaleString()} VND`,
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (orderDate) => new Date(orderDate).toLocaleString(),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) =>
        editingOrder === record.id ? (
          <Select
            value={updatedOrders.status}
            onChange={(value) => handleChange("status", value)}
            style={{ width: 200 }}
          >
            <Option value="Người bán đang chuẩn bị hàng">Người bán đang chuẩn bị hàng</Option>
            <Option value="Đang giao hàng">Đang giao hàng</Option>
            <Option value="Đã nhận hàng">Đã nhận hàng</Option>
            <Option value="Hủy đơn hàng">Hủy đơn hàng</Option>
          </Select>
        ) : (
          status
        ),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (paymentStatus, record) =>
        editingOrder === record.id ? (
          <Select
            value={updatedOrders.paymentStatus}
            onChange={(value) => handleChange("paymentStatus", value)}
            style={{ width: 150 }}
          >
            <Option value="Chưa thanh toán">Chưa thanh toán</Option>
            <Option value="Đã thanh toán">Đã thanh toán</Option>
          </Select>
        ) : (
          paymentStatus
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="primary"
          >
            Sửa
          </Button>
          {editingOrder === record.id && (
            <Button type="primary" onClick={handleUpdate}>
              Lưu
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: "Xem chi tiết",
      key: "details",
      render: (_, record) => (
        <Button type="link">
          <Link to={`/order/${record.id}`}>Xem chi tiết</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="order-admin-container">
      <Title level={2} className="order-admin-title">
        Quản lý đơn hàng
      </Title>
      <Select
        value={filterStatus}
        onChange={(value) => setFilterStatus(value)}
        placeholder="Tất cả trạng thái"
        style={{ width: 200, marginBottom: 16 }}
        allowClear
      >
        <Option value="">Tất cả trạng thái</Option>
        <Option value="Người bán đang chuẩn bị hàng">Người bán đang chuẩn bị hàng</Option>
        <Option value="Đang giao hàng">Đang giao hàng</Option>
        <Option value="Đã nhận hàng">Đã nhận hàng</Option>
        <Option value="Hủy đơn hàng">Hủy đơn hàng</Option>
      </Select>
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={false}
          className="order-table"
        />
      )}
    </div>
  );
}