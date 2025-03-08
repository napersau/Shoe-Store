import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import GoogleIcon from "@mui/icons-material/Google";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken } from "../services/localStorageService";
import Header from "./header_client/HeaderClient";

export default function Login() {
  const navigate = useNavigate();

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  const handleClick = async () => {
    try {
      window.location.href = "http://localhost:8080/oauth2/authorization/google";
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      setSnackBarMessage(error.message);
      setSnackBarOpen(true);
    }
    
  };



  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:8080/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Response body:", data);

        // This code is a commitment between BE and FE
        if (data.code !== 1000) {
          // throw new Error(data.message);
          throw new Error(`Tên đăng nhập hoặc mật khẩu không đúng!`);
        }

        setToken(data.result?.token);

        navigate("/home"); // -> trang home
      })
      .catch((error) => {
        setSnackBarMessage(error.message);
        setSnackBarOpen(true);
      });
  };

  return (
    <>
      <Header></Header>
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        bgcolor={"#f0f2f5"}
      >
        <Card
          sx={{
            minWidth: 400,
            maxWidth: 500,
            boxShadow: 4,
            borderRadius: 4,
            padding: 4,
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom>
              Đăng nhập
            </Typography>
            <Box
              component="form"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              width="100%"
              onSubmit={handleSubmit}
            >
              <TextField
                label="Tài khoản"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Mật khẩu"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                // onClick={handleSubmit}
                fullWidth
                sx={{
                  mt: "15px",
                  mb: "25px",
                }}
              >
                Đăng nhập
              </Button>
              <Divider></Divider>
            </Box>

            <Box display="flex" flexDirection="column" width="100%" gap="25px">
              <Button
                type="button"
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleClick}
                fullWidth
                sx={{ gap: "10px" }}
              >
                <GoogleIcon />
                Đăng nhập bằng Google
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                onClick={() => (window.location.href = "http://localhost:3000/register")}
              >
                Tạo tài khoản
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
