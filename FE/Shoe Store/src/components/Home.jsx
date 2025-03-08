import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/localStorageService";
import Header from "./header/Header";

import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";




export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const accessToken = getToken();
    if (!accessToken) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header />

      {/* Sidebar */}
      <Drawer variant="permanent" open={isSidebarOpen}>
        <Box
          sx={{
            width: isSidebarOpen ? 250 : 70,
            height: "100vh",
            backgroundColor: "#f5f5f5",
            padding: 2,
            transition: "width 0.3s",
       
          }}
        >
          {/* Nút thu gọn/mở rộng */}
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>

          {/* Tiêu đề Sidebar */}
          {isSidebarOpen && (
            <Typography variant="h6" sx={{ marginBottom: 2, textAlign: "center" }}>
              Shoe Store
            </Typography>
          )}

          {/* Danh sách điều hướng */}
          <List>
            {[
              { text: "Quản lý sản phẩm", path: "/admin/products" },
              { text: "Quản lý đơn hàng", path: "/admin/order" },
              { text: "Quản lý tài khoản", path: "/accounts" },
            ].map((item) => (
              <ListItem button key={item.text} onClick={() => navigate(item.path)}>
                <ListItemText primary={isSidebarOpen ? item.text : ""} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Nội dung chính */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
          <Typography>Loading ...</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            marginLeft: isSidebarOpen ? "260px" : "90px", // Đẩy nội dung qua phải khi sidebar mở rộng
            transition: "margin-left 0.3s",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "20px",
            marginTop: "100px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/admin/products")}
          >
            Quản lý sản phẩm
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/admin/order")}
          >
            Quản lý đơn hàng
          </Button>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={() => navigate("/accounts")}
          >
            Quản lý tài khoản
          </Button>
        </Box>
      )}
    </>
  );
}
