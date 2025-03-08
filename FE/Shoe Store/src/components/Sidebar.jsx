import React, { useState } from "react";
import { Drawer, Box, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
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
  );
}
