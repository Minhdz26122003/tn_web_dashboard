import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginController = (url, onLogin) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    JSON.parse(localStorage.getItem("rememberMe")) || false
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (rememberMe) {
      setUsername(localStorage.getItem("username") || "");
      setPassword(localStorage.getItem("password") || "");
    }
  }, [rememberMe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { username, password };

      // Mã hóa Base64 với UTF-8
      const encodedData = btoa(encodeURIComponent(JSON.stringify(payload)));
      const response = await fetch(`${url}apihm/Admin/Auth/Login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: encodedData }),
      });

      if (!response.ok) throw new Error("Không thể kết nối đến server.");
      const data = await response.json();

      if (data.error && data.error.code === 0 && data.data) {
        // Lưu token vào localStorage

        onLogin(data.data, rememberMe);
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("rememberMe", rememberMe);
        if (rememberMe) {
          localStorage.setItem("username", username);
          // localStorage.setItem("password", password);
        }
        navigate("/"); // Chuyển hướng về trang chủ
      } else {
        setError(data.error?.message || "Đăng nhập thất bại.");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };
  return {
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
  };
};
export default LoginController;
