import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import "./Login.css";
import url from "../../Global/ipconfixad";
import LoginController from "../../Controller/Login/LoginController";

const LoginPage = ({ onLogin }) => {
  const {
    username,
    password,
    rememberMe,
    error,
    navigate,
    setUsername,
    handleSubmit,
    setPassword,
    setRememberMe,
    setError,
  } = LoginController(url, onLogin);

  return (
    <div className="login-container">
      {/* Form đăng nhập ở giữa */}
      <Box component="form" onSubmit={handleSubmit} className="login-box">
        <Typography variant="h5" className="login-title">
          Đăng nhập
        </Typography>

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          className="login-input"
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          className="login-input"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          }
          label="Ghi nhớ đăng nhập"
          className="login-remember"
        />

        {error && <Typography className="login-error">{error}</Typography>}

        <Button type="submit" variant="contained" className="login-button">
          Đăng nhập
        </Button>
      </Box>

      {/* Footer tùy chọn */}
      <div className="login-footer">
        © 2025, made with ♥ by Creative Minh for a better web.
      </div>
    </div>
  );
};

export default LoginPage;
