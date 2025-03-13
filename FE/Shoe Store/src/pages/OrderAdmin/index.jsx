import { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  IconButton,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";

export default function OrderAdmin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
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
        setSnackBarOpen(true);
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
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật đơn hàng:", error);
        setError(error.message);
        setSnackBarOpen(true);
      });
  };

  const handleChange = (field, value) => {
    setUpdatedOrders((prev) => ({ ...prev, [field]: value }));
  };

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" mt="100px">
        <Typography variant="h4" gutterBottom>
          Quản lý đơn hàng
        </Typography>

        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          displayEmpty
          sx={{ mb: 2 }}
        >
          <MenuItem value="">Tất cả trạng thái</MenuItem>
          <MenuItem value="Người bán đang chuẩn bị hàng">Người bán đang chuẩn bị hàng</MenuItem>
          <MenuItem value="Đang giao hàng">Đang giao hàng</MenuItem>
          <MenuItem value="Đã nhận hàng">Đã nhận hàng</MenuItem>
          <MenuItem value="Hủy đơn hàng">Hủy đơn hàng</MenuItem>
        </Select>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={() => setSnackBarOpen(false)}>
            <Alert severity="error">{error}</Alert>
          </Snackbar>
        ) : (
          <TableContainer component={Paper} sx={{ width: "90%", mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>ID</b></TableCell>
                  <TableCell><b>Họ tên</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Địa chỉ</b></TableCell>
                  <TableCell><b>Tổng tiền</b></TableCell>
                  <TableCell><b>Ngày đặt</b></TableCell>
                  <TableCell><b>Ghi chú</b></TableCell>
                  <TableCell><b>Phương thức thanh toán</b></TableCell>
                  <TableCell><b>Trạng thái</b></TableCell>
                  <TableCell><b>Trạng thái thanh toán</b></TableCell>
                  <TableCell><b>Hành động</b></TableCell>
                  <TableCell><b>Xem chi tiết</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.fullName}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>{order.address}</TableCell>
                    <TableCell>{order.totalMoney}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                    <TableCell>{order.note}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>
                      {editingOrder === order.id ? (
                        <Select value={updatedOrders.status} onChange={(e) => handleChange("status", e.target.value)}>
                          <MenuItem value="Người bán đang chuẩn bị hàng">Người bán đang chuẩn bị hàng</MenuItem>
                          <MenuItem value="Đang giao hàng">Đang giao hàng</MenuItem>
                          <MenuItem value="Đã nhận hàng">Đã nhận hàng</MenuItem>
                          <MenuItem value="Hủy đơn hàng">Hủy đơn hàng</MenuItem>
                        </Select>
                      ) : (
                        order.status
                      )}
                    </TableCell>
                    <TableCell>
                      {editingOrder === order.id ? (
                        <Select value={updatedOrders.paymentStatus} onChange={(e) => handleChange("paymentStatus", e.target.value)}>
                          <MenuItem value="Chưa thanh toán">Chưa thanh toán</MenuItem>
                          <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
                        </Select>
                      ) : (
                        order.paymentStatus
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(order)}>
                        <EditIcon />
                      </IconButton>
                      {editingOrder === order.id && (
                        <Button variant="contained" color="primary" onClick={handleUpdate}>
                          Lưu
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" component={Link} to={`/order/${order.id}`}>Xem chi tiết</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
}
