import React, { useEffect, useState } from "react";
import { getToken } from "../../services/localStorageService";
import { useNavigate } from "react-router-dom";
import { Table, Spin, Alert, Typography, Select, Button } from "antd";
import { Link } from "react-router-dom";
import "./styles.css";

const { Title } = Typography;
const { Option } = Select;

const OrderClient = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    const fetchOrders = async () => {
      try {
        const url = status ? `http://localhost:8080/order/filter?status=${status}` : "http://localhost:8080/order";
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu đơn hàng");
        }

        const data = await response.json();
        // Sort orders by orderDate in descending order (most recent first)
        const sortedOrders = data.result.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, status]);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName", width: 150 },
    { title: "Email", dataIndex: "email", key: "email", width: 200 },
    { title: "Địa chỉ", dataIndex: "address", key: "address", width: 200 },
    { title: "Ghi chú", dataIndex: "note", key: "note", width: 150 },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      width: 150,
      render: (text) => new Date(text).toLocaleString(),
    },
    { title: "Trạng thái", dataIndex: "status", key: "status", width: 150 },
    {
      title: "Tổng tiền",
      dataIndex: "totalMoney",
      key: "totalMoney",
      width: 120,
      render: (text) => `${text.toLocaleString()} VND`,
    },
    { 
      title: "Phương thức thanh toán", 
      dataIndex: "paymentMethod", 
      key: "paymentMethod", 
      width: 180 // Increased width for better visibility
    },
    { 
      title: "Trạng thái thanh toán", 
      dataIndex: "paymentStatus", 
      key: "paymentStatus", 
      width: 180 // Increased width for better visibility
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Link to={`/order/${record.id}`}>
          <Button type="primary" size="small">
            Xem chi tiết
          </Button>
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="order-container">
      <Title level={3}>Danh sách đơn hàng</Title>
      <Select
        value={status}
        onChange={(value) => setStatus(value)}
        placeholder="Chọn trạng thái"
        className="status-select"
      >
        <Option value="">Tất cả</Option>
        <Option value="Người bán đang chuẩn bị hàng">Người bán đang chuẩn bị hàng</Option>
        <Option value="Đang giao hàng">Đang giao hàng</Option>
        <Option value="Đã nhận hàng">Đã nhận hàng</Option>
        <Option value="Hủy đơn hàng">Hủy đơn hàng</Option>
      </Select>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        className="order-table"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default OrderClient;