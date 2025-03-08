import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Typography,
  Paper,
} from "@mui/material";
import { getToken } from "../services/localStorageService";
import Header from "./header/Header";

export default function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    imageBase64: "",
    imageName: "",
    description: "",
    brand: "",
    color: "",
    category_id: 2,
  });

  const [error, setError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProduct({
          ...product,
          imageBase64: reader.result.split(",")[1],
          imageName: file.name,
        });
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
  
    try {
      const response = await fetch("http://localhost:8080/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
  
      if (!response.ok) throw new Error("Không thể thêm sản phẩm!");
  
      setSnackBarOpen(true);
      setTimeout(() => navigate("/admin/products"), 3000); // Để snackbar có thời gian hiển thị
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <>
      <Header />
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Paper sx={{ padding: 4, width: "50%" }}>
          <Typography variant="h4" gutterBottom>Thêm Sản Phẩm</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Tên sản phẩm"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Giá"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              required
            />

            {/* Upload ảnh */}
            <Box mt={2} mb={2} textAlign="center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  display: "block",
                  margin: "auto",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              />
              {product.imageBase64 && (
                <img
                  src={`data:image/png;base64,${product.imageBase64}`}
                  alt="Ảnh sản phẩm"
                  style={{ marginTop: "10px", width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                />
              )}
            </Box>

            <TextField
              fullWidth
              margin="normal"
              label="Mô tả"
              name="description"
              multiline
              rows={4}
              value={product.description}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Thương hiệu"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Màu sắc"
              name="color"
              value={product.color}
              onChange={handleChange}
              required
            />

            {/* Dropdown danh mục */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Danh mục</InputLabel>
              <Select
                name="category_id"
                value={product.category_id}
                onChange={handleChange}
                required
              >
                <MenuItem value={2}>Giày</MenuItem>
                <MenuItem value={1}>Phụ kiện</MenuItem>
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Thêm Sản Phẩm
            </Button>
          </form>
        </Paper>

        {/* Thông báo khi thêm thành công */}
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackBarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="success">Sản phẩm đã được thêm thành công!</Alert>
        </Snackbar>

        {/* Thông báo lỗi */}
        {error && (
          <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}>
            <Alert severity="error">{error}</Alert>
          </Snackbar>
        )}
      </Box>
    </>
  );
}
