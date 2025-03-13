import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, TableContainer } from "@mui/material";
import { getToken } from "../../services/localStorageService";

const OrderDetails = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/order-details/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu chi tiết đơn hàng");
        }

        const data = await response.json();
        const ordersWithProductDetails = await Promise.all(
          data.result.map(async (item) => {
            const productResponse = await fetch(`http://localhost:8080/products/client/${item.productId}`);
            if (!productResponse.ok) {
              throw new Error("Lỗi khi lấy thông tin sản phẩm");
            }
            const productData = await productResponse.json();
            return { ...item, product: productData.result };
          })
        );

        setOrderDetails(ordersWithProductDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <>
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Box display="flex" justifyContent="center" mt={5}>
          <Typography color="error">{error}</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Chi tiết đơn hàng #{id}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ảnh sản phẩm</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Màu sắc</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Tổng tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img src={item.product.image} alt={item.product.name} width="50" height="50" />
                  </TableCell>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.product.price.toLocaleString()} VND</TableCell>
                  <TableCell>{item.product.color || "Không có"}</TableCell>
                  <TableCell>{item.numberOfProducts}</TableCell>
                  <TableCell>{item.totalMoney.toLocaleString()} VND</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default OrderDetails;
