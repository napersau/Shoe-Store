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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/localStorageService";
import Header from "./header/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProductAdmin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = () => {
    setLoading(true);
    const token = getToken();
    fetch("http://localhost:8080/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải danh sách sản phẩm!");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        setError(error.message);
        setLoading(false);
        setSnackBarOpen(true);
      });
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const [successMessage, setSuccessMessage] = useState("");

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      const token = getToken();
      fetch(`http://localhost:8080/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Không thể xóa sản phẩm!");
          }
          setProducts(products.filter((product) => product.id !== id));
  
          // Hiển thị thông báo xóa thành công
          setSuccessMessage("Xóa sản phẩm thành công!");
          setSnackBarOpen(true);
        })
        .catch((error) => {
          console.error("Lỗi khi xóa sản phẩm:", error);
          setError(error.message);
          setSnackBarOpen(true);
        });
    }
  };

  return (
    <>
      <Header />

      



      <Box display="flex" flexDirection="column" alignItems="center" mt="100px">
        <Typography variant="h4" gutterBottom>
          Danh sách sản phẩm
        </Typography>

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
                  <TableCell><b>Tên sản phẩm</b></TableCell>
                  <TableCell><b>Giá</b></TableCell>
                  <TableCell><b>Hình ảnh</b></TableCell>
                  <TableCell><b>Mô tả</b></TableCell>
                  <TableCell><b>Thương hiệu</b></TableCell>
                  <TableCell><b>Màu sắc</b></TableCell>
                  <TableCell><b>Danh mục</b></TableCell>
                  <TableCell><b>Chức năng</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price.toLocaleString()} VND</TableCell>
                    <TableCell>
                      <img src={product.image} alt={product.name} width="80" height="80" />
                    </TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.color}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(product.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(product.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Hàng chứa nút "Thêm sản phẩm" */}
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Button variant="contained" color="primary" onClick={() => navigate("/admin/add-product")}>
                      Thêm sản phẩm
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackBarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Hiển thị góc phải trên cùng
      >
        <Alert severity={successMessage ? "success" : "error"}>
          {successMessage || error}
        </Alert>
      </Snackbar>
    </>
  );
}
