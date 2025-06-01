import React, { useEffect, useState, useCallback } from "react";
import { getToken } from "../../services/localStorageService";
import { useNavigate } from "react-router-dom";
import {
  Box, CircularProgress, Table, TableBody, TableCell, TableHead,
  TableRow, Paper, Typography, TableContainer, Button, IconButton
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const Cart = () => {
  const [cartDetails, setCartDetails] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const navigate = useNavigate();

  const token = getToken();

  // Lấy chi tiết giỏ hàng
  const fetchCartDetails = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/cart-detail", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Lỗi khi lấy giỏ hàng");
      const data = await res.json();
      setCartDetails(data.result || []);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  // Lấy tổng tiền
  const fetchTotalMoney = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Lỗi khi lấy tổng tiền");
      const data = await res.json();
      setTotalMoney(data.result?.totalMoney || 0);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const loadData = async () => {
      setLoading(true);
      await fetchCartDetails();
      await fetchTotalMoney();
      setLoading(false);
    };
    loadData();
  }, [token, navigate, fetchCartDetails, fetchTotalMoney]);

  const handleDelete = async (cartId) => {
    try {
      const res = await fetch(`http://localhost:8080/cart-detail/${cartId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Xóa sản phẩm thất bại");

      const updatedCart = cartDetails.filter(item => item.id !== cartId);
      setCartDetails(updatedCart);
      const newTotal = updatedCart.reduce((sum, item) => sum + item.totalMoney, 0);
      setTotalMoney(newTotal);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateQuantity = async (cartId, newQty) => {
    if (newQty < 1) return;

    setUpdatingItems(prev => new Set([...prev, cartId]));
    try {
      const res = await fetch(`http://localhost:8080/cart-detail/${cartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ numberOfProducts: newQty }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      const data = await res.json();
      const updatedCart = cartDetails.map(item =>
        item.id === cartId
          ? { ...item, numberOfProducts: newQty, totalMoney: data.result.totalMoney }
          : item
      );

      setCartDetails(updatedCart);
      const newTotal = updatedCart.reduce((sum, item) => sum + item.totalMoney, 0);
      setTotalMoney(newTotal);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartId);
        return newSet;
      });
    }
  };

  const renderQuantityControl = (item) => (
    <Box display="flex" alignItems="center" gap={1}>
      <IconButton
        size="small"
        disabled={item.numberOfProducts <= 1 || updatingItems.has(item.id)}
        onClick={() => updateQuantity(item.id, item.numberOfProducts - 1)}
      >
        <Remove />
      </IconButton>
      <Typography>
        {updatingItems.has(item.id) ? "..." : item.numberOfProducts}
      </Typography>
      <IconButton
        size="small"
        disabled={updatingItems.has(item.id)}
        onClick={() => updateQuantity(item.id, item.numberOfProducts + 1)}
      >
        <Add />
      </IconButton>
    </Box>
  );

  const handlePayment = () => {
    navigate("/payments-cart", { state: { cartDetails, totalMoney } });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography style={{marginTop:80}} variant="h4" gutterBottom>Giỏ hàng của bạn</Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : cartDetails.length === 0 ? (
        <Typography>Giỏ hàng trống</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ width: "80%", borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Đơn giá (VND)</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Tổng tiền (VND)</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartDetails.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img src={item.product.image} alt={item.product.name} style={{ width: 80, height: 80 }} />
                  </TableCell>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.size || "Không có"}</TableCell>
                  <TableCell>{item.product.price.toLocaleString()} VND</TableCell>
                  <TableCell>{renderQuantityControl(item)}</TableCell>
                  <TableCell>{item.totalMoney.toLocaleString()} VND</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(item.id)}
                      disabled={updatingItems.has(item.id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5} align="right">Tổng tiền:</TableCell>
                <TableCell colSpan={2}><strong>{totalMoney.toLocaleString()} VND</strong></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={7} align="right">
                  <Button variant="outlined" sx={{ mr: 2 }} onClick={() => navigate("/shop")}>
                    Tiếp tục mua hàng
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handlePayment}>
                    Tiến hành thanh toán
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Cart;
