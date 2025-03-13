/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import ColorPicker from "../../components/colorDropDown";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);




  // State cho bộ lọc
  const [filters, setFilters] = useState({
    name: "",
    priceFrom: null,
    priceTo: null,
    brand: "",
    color: "",
    category_id: null,
  });

  // State cho sắp xếp
  const [sortBy, setSortBy] = useState(""); // Giá trị: "price ASC" hoặc "price DESC"

  useEffect(() => {
    fetchProducts({});
  }, []);

  const fetchProducts = (searchParams) => {
    setLoading(true);
    setError("");

    // Thêm sortBy vào query params nếu có giá trị
    if (sortBy) {
      searchParams.sortBy = sortBy;
    }

    const queryString = new URLSearchParams(
      Object.entries(searchParams).filter(([_, value]) => value !== null && value !== "")
    ).toString();

    fetch(`http://localhost:8080/products/product-list?${queryString}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải danh sách sản phẩm!");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.result || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        setError(error.message);
        setLoading(false);
        setSnackBarOpen(true);
      });
  };
  const handleSearch = () => {
    const searchParams = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        searchParams[key] = filters[key];
      }
    });

    fetchProducts(searchParams);
  };

  return (
    <>
      <Box display="flex" mt="50px">
        {/* Bên Trái: Form tìm kiếm */}
        <Box width="20%" p={2} borderRight="1px solid #ddd">
          <Typography variant="h6" gutterBottom>
            Bộ lọc sản phẩm
          </Typography>
          <TextField
            label="Tên sản phẩm"
            fullWidth
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Giá cả"
            select
            fullWidth
            value={filters.priceFrom !== null || filters.priceTo !== null ? `${filters.priceFrom || ""}-${filters.priceTo || ""}` : ""}
            onChange={(e) => {
              const [priceFrom, priceTo] = e.target.value.split("-").map(v => v === "" ? null : Number(v));
              setFilters({ ...filters, priceFrom, priceTo });
            }}
            margin="dense"
          >
            <MenuItem value="-">Tất cả</MenuItem>
            <MenuItem value={"-1000000"}>Dưới 1 triệu</MenuItem>
            <MenuItem value={"1000000-2000000"}>Từ 1 triệu đến 2 triệu</MenuItem>
            <MenuItem value={"2000000-3000000"}>Từ 2 triệu đến 3 triệu</MenuItem>
            <MenuItem value={"3000000-5000000"}>Từ 3 triệu đến 5 triệu</MenuItem>
            <MenuItem value={"5000000-"}>Trên 5 triệu</MenuItem>
          </TextField>

          <TextField
            label="Thương hiệu"
            select
            fullWidth
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            margin="dense"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value={"Vans"}>Vans</MenuItem>
            <MenuItem value={"Adidas"}>Adidas</MenuItem>
            <MenuItem value={"Nike"}>Nike</MenuItem>
            <MenuItem value={"Shucare"}>Shucare</MenuItem>
          </TextField>

          <ColorPicker />

          <TextField
            label="Danh mục"
            select
            fullWidth
            value={filters.category_id ?? ""}
            onChange={(e) =>
              setFilters({ ...filters, category_id: e.target.value || null })
            }
            margin="dense"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value={1}>Phụ kiện</MenuItem>
            <MenuItem value={2}>Giày</MenuItem>
          </TextField>

          {/* Dropdown sắp xếp */}
          <TextField
            label="Sắp xếp theo"
            select
            fullWidth
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            margin="dense"
          >
            <MenuItem value="">Mặc định</MenuItem>
            <MenuItem value="price ASC">Giá tăng dần</MenuItem>
            <MenuItem value="price DESC">Giá giảm dần</MenuItem>
          </TextField>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </Box>

        {/* Bên Phải: Danh sách sản phẩm */}
        <Box flex={1} p={2}>
          <Typography variant="h4" gutterBottom align="center">
            Cửa hàng
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Snackbar
              open={snackBarOpen}
              autoHideDuration={6000}
              onClose={() => setSnackBarOpen(false)}
            >
              <Alert severity="error">{error}</Alert>
            </Snackbar>
          ) : (
            <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: "85%", margin: "0 auto" }}>
              {products.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} >
                  <Card
                    className="product-card"
                    sx={{
                      // border: "1px solid #333",
                      p: 1,
                      borderRadius: "20px",
                      boxshadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
                      maxWidth: "300px", // Giảm kích thước card sản phẩm
                      margin: "auto", // Căn giữa trong grid
                      marginTop: "20px", 
                    }}
                  >
                    <div className="image-container" style={{ textAlign: "center" }}>
                      <CardMedia
                        component="img"
                        sx={{
                          height: "250px", // Giảm chiều cao ảnh
                          width: "auto",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                        image={`${product.image}`} // Đảm bảo đường dẫn đúng
                        alt={product.name}
                        className="product-image"
                      />
                      <div className="overlay">
                        <Link
                          className="btn btn-success text-white mt-2"
                          to={`/shop/${product.id}`}
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                    <CardContent sx={{ padding: "8px" }}>
                      <Typography variant="h6" align="center" sx={{ fontSize: "14px" }}>
                        {product.name}
                      </Typography>
                      <Typography variant="subtitle1" align="center" sx={{ fontSize: "12px" }}>
                        {product.price.toLocaleString()} VND
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

          )}
        </Box>
      </Box >
    </>
  );
}
