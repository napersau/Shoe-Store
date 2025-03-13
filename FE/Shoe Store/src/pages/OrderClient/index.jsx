import React, { useEffect, useState } from "react";
import { getToken } from "../../services/localStorageService";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableContainer,
  Select,
  MenuItem,
} from "@mui/material";

import { Link } from "react-router-dom";
import { Button } from "@mui/material";

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
        setOrders(data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, status]);

  if (loading) {
    return (
      <>

        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Box display="flex" justifyContent="center" mt={5}>
          <Typography color="error">{error}</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Danh sách đơn hàng
        </Typography>

        <Select value={status} onChange={(e) => setStatus(e.target.value)} displayEmpty>
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="Người bán đang chuẩn bị hàng">Người bán đang chuẩn bị hàng</MenuItem>
          <MenuItem value="Đang giao hàng">Đang giao hàng</MenuItem>
          <MenuItem value="Đã nhận hàng">Đã nhận hàng</MenuItem>
          <MenuItem value="Hủy đơn hàng">Hủy đơn hàng</MenuItem>
        </Select>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Ngày đặt hàng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Phương thức thanh toán</TableCell>
                <TableCell>Trạng thái thanh toán</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.fullName}</TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.note}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.totalMoney.toLocaleString()} VND</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>{order.paymentStatus}</TableCell>
                  <TableCell>
                    <Link to={`/order/${order.id}`}>
                      <Button variant="contained" color="primary" size="small">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default OrderClient;
