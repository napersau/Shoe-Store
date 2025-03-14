import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { getToken } from "../../services/localStorageService";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`http://localhost:8080/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải sản phẩm:", err);
        setError("Không thể tải sản phẩm!");
        setSnackBarOpen(true);
        setLoading(false);
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setProduct({ ...product, imageBase64: reader.result.split(",")[1], imageName: file.name });
      };
      setImageFile(file);
    }
  };

  const handleUpdate = () => {
    const token = getToken();
    fetch(`http://localhost:8080/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Cập nhật sản phẩm thất bại!");
        }
        return res.json();
      })
      .then(() => {
        setSuccessMessage("Cập nhật sản phẩm thành công!");
        setSnackBarOpen(true);
        setTimeout(() => navigate("/admin/products"), 2000); // Quay lại sau 2 giây
      })
      .catch((err) => {
        console.error("Lỗi cập nhật sản phẩm:", err);
        setError("Không thể cập nhật sản phẩm!");
        setSnackBarOpen(true);
      });
  };

  if (loading) return <CircularProgress />;
  if (!product) return <p>Không tìm thấy sản phẩm!</p>;

  return (
    <>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt="50px"
        paddingTop="80px" // Thêm padding để tránh bị header che mất
      >
        <h2>Chỉnh sửa sản phẩm</h2>
        <TextField
            label="Tên sản phẩm"
            name="name"
            value={product.name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ maxWidth: "75%" }} // 👈 Thu nhỏ chiều rộng
            />
            <TextField
            label="Giá"
            name="price"
            type="number"
            value={product.price || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ maxWidth: "75%" }} 
            />
            {product.image && (
              <img
                src={product.image}
                alt="Hình ảnh sản phẩm"
                width="100"
                height="100"
                style={{ display: "block", marginBottom: "10px", objectFit: "cover" }}
              />
            )}

            <TextField
              label="Hình ảnh (URL)"
              name="image"
              value={product.image || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{ maxWidth: "75%" }}
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />

            <TextField
            label="Thương hiệu"
            name="brand"
            value={product.brand || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ maxWidth: "75%" }} 
            />
            <TextField
            label="Màu sắc"
            name="color"
            value={product.color || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ maxWidth: "75%" }} 
            />
            <FormControl fullWidth margin="normal" sx={{ maxWidth: "75%" }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
                name="category_id"
                value={product?.category?.id ?? ""} // ✅ Lấy từ `product.category.id`
                onChange={(e) => setProduct({ ...product, category: { id: e.target.value } })} // ✅ Giữ đúng cấu trúc
            >
                <MenuItem value={2}>Giày</MenuItem>
                <MenuItem value={1}>Phụ kiện</MenuItem>
            </Select>
            </FormControl>
            <TextField
            label="Mô tả"
            name="description"
            multiline
            rows={4}
            value={product.description || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ maxWidth: "75%" }} 
            />
        <Box display="flex" gap={2} mt={3}>
          <Button variant="contained" color="secondary" onClick={() => navigate("/admin/products")}>
            Hủy
          </Button>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Cập nhật
          </Button>
        </Box>

        <Snackbar
            open={snackBarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackBarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }} // ✅ Đặt vị trí góc trên phải
            >
            <Alert severity={successMessage ? "success" : "error"}>{successMessage || error}</Alert>
        </Snackbar>
      </Box>
    </>
  );
}
