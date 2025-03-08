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
    IconButton,
    InputAdornment,
  } from "@mui/material";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import Visibility from "@mui/icons-material/Visibility";
  import VisibilityOff from "@mui/icons-material/VisibilityOff";
  import Header from "./header_client/HeaderClient";
  
  export default function Register() {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    
    const handleCloseSnackBar = (event, reason) => {
      if (reason === "clickaway") return;
      setSnackBarOpen(false);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      if (password !== confirmPassword) {
        setSnackBarMessage("Passwords do not match!");
        setSnackBarOpen(true);
        return;
      }
      
      fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, phoneNumber, fullName }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code !== 1000) throw new Error(data.message);
          setSnackBarMessage("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
          setSnackBarOpen(true);
          setTimeout(() => navigate("/login"), 2000);
        })
        .catch((error) => {
          setSnackBarMessage(`Tên đăng nhập đã tồn tại!`);
          setSnackBarOpen(true);
        });
    };
    
    return (
      <>
        <Header></Header>
        <Snackbar open={snackBarOpen} onClose={handleCloseSnackBar} autoHideDuration={6000} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert onClose={handleCloseSnackBar} severity={snackBarMessage.includes("successful") ? "success" : "error"} variant="filled" sx={{ width: "100%" }}>
            {snackBarMessage}
          </Alert>
        </Snackbar>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="#f0f2f5">
          <Card sx={{ minWidth: 400, maxWidth: 500, boxShadow: 4, borderRadius: 4, padding: 4 }}>
            <CardContent>
              <Typography variant="h5" component="h1" gutterBottom>Đăng ký tài khoản</Typography>
              <Box component="form" display="flex" flexDirection="column" alignItems="center" width="100%" onSubmit={handleSubmit}>
                <TextField label="Tên đăng nhập" variant="outlined" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                <TextField 
                  label="Mật khẩu" 
                  type={showPassword ? "text" : "password"} 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField 
                  label="Nhập lại mật khẩu" 
                  type={showPassword ? "text" : "password"} 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField label="Tên đầy đủ" variant="outlined" fullWidth margin="normal" value={fullName} onChange={(e) => setFullName(e.target.value)} required/>
                <TextField label="Số điện thoại" variant="outlined" fullWidth margin="normal" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required/>
                
                <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ mt: "15px", mb: "25px" }}>Đăng ký</Button>
                <Divider />
                <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate("/login")} sx={{ mt: "15px" }}>Trở lại đăng nhập</Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </>
    );
  }
