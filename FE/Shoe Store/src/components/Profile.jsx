import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/localStorageService";
import Header from "./header_client/HeaderClient";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        setError(error.message);
        setLoading(false);
        setSnackBarOpen(true);
      });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setUpdatedUser({
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
        setSnackBarOpen(true);
        setTimeout(() => {
            window.location.reload(); // Load lại trang sau khi cập nhật thành công
          }, 5000);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        setError(error.message);
        setSnackBarOpen(true);
      });
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header />
      <Box display="flex" flexDirection="column" alignItems="center" mt="100px">
        <Typography variant="h4" gutterBottom>
          Thông tin cá nhân
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Paper elevation={3} sx={{ padding: 3, width: "50%" }}>
            {editing ? (
              <>
                <TextField fullWidth margin="normal" label="Họ và tên" name="fullName" value={updatedUser.fullName} onChange={handleChange} />
                <TextField fullWidth margin="normal" label="Địa chỉ" name="address" value={updatedUser.address} onChange={handleChange} />
                <TextField fullWidth margin="normal" label="Số điện thoại" name="phoneNumber" value={updatedUser.phoneNumber} onChange={handleChange} />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Ngày sinh"
                  name="dateOfBirth"
                  type="date"
                  value={updatedUser.dateOfBirth ? updatedUser.dateOfBirth.substring(0, 10) : ""}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true, // Giữ nhãn luôn hiển thị
                  }}
                />
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button variant="contained" color="secondary" onClick={handleCancel}>Hủy</Button>
                  <Button variant="contained" color="primary" onClick={handleUpdate}>Cập nhật</Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h6">Tên đăng nhập: {user?.username || "Chưa cập nhật"}</Typography>
                <Typography variant="h6">Họ và tên: {user?.fullName || "Chưa cập nhật"}</Typography>
                <Typography variant="h6">Địa chỉ: {user?.address || "Chưa cập nhật"}</Typography>
                <Typography variant="h6">Ngày sinh: {user?.dateOfBirth || "Chưa cập nhật"}</Typography>
                <Typography variant="h6">Số điện thoại: {user?.phoneNumber || "Chưa cập nhật"}</Typography>


                <Box mt={2}>
                  <Button variant="contained" color="primary" onClick={handleEdit}>Chỉnh sửa thông tin</Button>
                </Box>
              </>
            )}
          </Paper>
        )}
      </Box>
      <Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={() => setSnackBarOpen(false)}>
        <Alert severity={error ? "error" : "success"}>{error || "Cập nhật thành công!"}</Alert>
      </Snackbar>
    </>
  );
}