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
  Button,
} from "@mui/material";

const Cart = () => {
  const [cartDetails, setCartDetails] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCartDetails = async () => {
      try {
        const response = await fetch("http://localhost:8080/cart-detail", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu giỏ hàng");
        }

        const data = await response.json();
        setCartDetails(data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalMoney = async () => {
      try {
        const response = await fetch("http://localhost:8080/cart", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Lỗi khi lấy tổng tiền");
        }

        const data = await response.json();
        setTotalMoney(data.result.totalMoney);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCartDetails();
    fetchTotalMoney();
  }, [navigate]);

  const handlePayment = () => {
    navigate("/payments-cart", { state: { cartDetails, totalMoney } });
  };

  const handleDelete = async (cartId) => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/cart-detail/${cartId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Xóa sản phẩm thất bại");
      }
  
      // Cập nhật danh sách giỏ hàng sau khi xóa
      setCartDetails((prevCart) => {
        const updatedCart = prevCart.filter((item) => item.id !== cartId);
  
        // Tính lại tổng tiền
        const newTotalMoney = updatedCart.reduce((sum, item) => sum + item.totalMoney, 0);
        setTotalMoney(newTotalMoney);
  
        return updatedCart;
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h4" gutterBottom>Giỏ hàng của bạn</Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : cartDetails.length === 0 ? (
          <Typography>Giỏ hàng trống</Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              width: "80%",
              borderRadius: 2,
              boxShadow: 3,
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold", borderRight: "1px solid #ddd" }}>Hình ảnh</TableCell>
                  <TableCell sx={{ fontWeight: "bold", borderRight: "1px solid #ddd" }}>Sản phẩm</TableCell>
                  <TableCell sx={{ fontWeight: "bold", borderRight: "1px solid #ddd" }}>Size</TableCell>
                  <TableCell sx={{ fontWeight: "bold", borderRight: "1px solid #ddd" }}>Đơn giá (VND)</TableCell>
                  <TableCell sx={{ fontWeight: "bold", borderRight: "1px solid #ddd" }}>Số lượng</TableCell>
                  <TableCell sx={{ fontWeight: "bold", borderRight: "1px solid #ddd" }}>Tổng tiền (VND)</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartDetails.map((item) => (
                  <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4 }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderRight: "1px solid #ddd" }}>{item.product.name}</TableCell>
                    <TableCell sx={{ borderRight: "1px solid #ddd" }}>{item.size || "Không có"}</TableCell>
                    <TableCell sx={{ borderRight: "1px solid #ddd" }}>{item.product.price.toLocaleString()} VND</TableCell>
                    <TableCell sx={{ borderRight: "1px solid #ddd" }}>{item.numberOfProducts}</TableCell>
                    <TableCell sx={{ borderRight: "1px solid #ddd" }}>{item.totalMoney.toLocaleString()} VND</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(item.id)}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5} align="right" sx={{ fontWeight: "bold" }}>
                    Tổng tiền:
                  </TableCell>
                  <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
                    {totalMoney.toLocaleString()} VND
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7} align="right">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate("/shop")}
                      sx={{ marginRight: 2 }}
                    >
                      Tiếp tục mua hàng
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handlePayment}
                    >
                      Tiến hành thanh toán
                    </Button>
                  </TableCell>
                </TableRow>
                
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
};

export default Cart;
