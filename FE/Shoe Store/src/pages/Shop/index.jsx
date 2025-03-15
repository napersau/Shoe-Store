/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  TextField,
  Button,
  MenuItem,
  Skeleton,
} from "@mui/material";
import { Link, useAsyncError } from "react-router-dom";
import ColorPicker from "../../components/colorDropDown";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [maxPage,setMaxPage]=useState(1);
  const limit = 6;

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
    console.log(queryString)
    fetch(`http://localhost:8080/products/product-list?${queryString}&limit=${limit}`, {
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
        setMaxPage(data.totalPages)
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
    setPage(0);
    const searchParams = { ...filters, page: 0 };
    fetchProducts(searchParams);
  };
  const onClickPrevPage = () => {
    if (page > 0) {
      setPage(prevPage => {
        const newPage = prevPage - 1;
        fetchProducts({ ...filters, page: newPage });
        return newPage;
      });
    }
  };

  const onClickNextPage = () => {
    setPage(prevPage => {
      const newPage = prevPage + 1;
      fetchProducts({ ...filters, page: newPage });
      console.log(maxPage)
      return newPage;
    });
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

          <ColorPicker
            value={filters.color}
            onChange={(color) => {
              const colorNames = {
                black: "Đen",
                white: "Trắng",
                red: "Đỏ",
                blue: "Xanh dương",
                green: "Xanh lá",
                yellow: "Vàng",
                "": "",
              };
              setFilters({ ...filters, color: colorNames[color] });
            }}
          />


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
            <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: "85%", margin: "0 auto" }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card
                    className="product-card"
                    sx={{
                      p: 1,
                      borderRadius: "20px",
                      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
                      maxWidth: "300px",
                      margin: "auto",
                      marginTop: "20px",
                      height: "355px",
                    }}
                  >
                    <div className="image-container" style={{ textAlign: "center" }}>
                      <Skeleton variant="rectangular" width="100%" height={250} />
                    </div>
                    <CardContent sx={{ padding: "8px" }}>
                      <Skeleton width="60%" height={24} sx={{ margin: "auto" }} />
                      <Skeleton width="40%" height={20} sx={{ margin: "auto", marginTop: "8px" }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
              {products.content.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4}>
                  <Card
                    className="product-card"
                    sx={{
                      p: 1,
                      height: "355px",
                      borderRadius: "20px",
                      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
                      maxWidth: "300px",
                      margin: "auto",
                      marginTop: "20px",
                    }}
                  >
                    <div className="image-container" style={{ textAlign: "center" }}>
                      <CardMedia
                        component="img"
                        sx={{
                          height: "250px",
                          width: "auto",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                        image={`${product.image}`}
                        alt={product.name}
                        className="product-image"
                      />
                      <div className="overlay">
                        <Link className="btn btn-success text-white mt-2" to={`/shop/${product.id}`}>
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
          <Typography variant="h4" gutterBottom align="center" sx={{ mt: 2 }}>
            <Button onClick={onClickPrevPage} disabled={page === 0}><ArrowBackIcon/></Button>
            <span style={{color:"blue", fontSize:"20px"}}>{page+1}</span>
            <Button onClick={onClickNextPage} disabled={page === (maxPage-1)}><ArrowForwardIcon/></Button>
          </Typography>
        </Box>
      </Box >
    </>
  );
}
