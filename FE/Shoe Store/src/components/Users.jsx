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
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/localStorageService";
import Header from "./header/Header";

export default function User() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = () => {
    setLoading(true);
    const token = getToken();
    fetch("http://localhost:8080/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải danh sách người dùng!");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        setError(error.message);
        setLoading(false);
        setSnackBarOpen(true);
      });
  };

  return (
    <>
      <Header />
      <Box display="flex" flexDirection="column" alignItems="center" mt="100px">
        <Typography variant="h4" gutterBottom>
          Danh sách người dùng
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={fetchUsers}
        >
          Quản lý tài khoản
        </Button>

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
                  <TableCell><b>Username</b></TableCell>
                  <TableCell><b>Họ và tên</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Địa chỉ</b></TableCell>
                  <TableCell><b>Ngày sinh</b></TableCell>
                  <TableCell><b>Số điện thoại</b></TableCell>
                  <TableCell><b>Trạng thái</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>{user.dateofbirth}</TableCell>
                    <TableCell>{user.phoneNumber || "Chưa cập nhật"}</TableCell>
                    <TableCell>
                      {user.active ? (
                        <Alert severity="success">Hoạt động</Alert>
                      ) : (
                        <Alert severity="error">Bị khóa</Alert>
                      )}
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
