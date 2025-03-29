import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./Router/AppRouters";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("HỆ THỐNG QUẢN TRỊ APP");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const storedUser =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    const rememberMe =
      JSON.parse(sessionStorage.getItem("rememberMe")) ||
      JSON.parse(localStorage.getItem("rememberMe")) ||
      false;
    const isLoggedOut =
      JSON.parse(localStorage.getItem("isLoggedOut")) || false;

    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedUser && !isLoggedOut) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setLoggedInUser(userData.username);
      setPermissions(userData.permissions || []);

      // Nếu không nhớ đăng nhập, chỉ lưu vào sessionStorage
      if (!rememberMe) {
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("username", userData.username);

        if (storedToken) {
          sessionStorage.setItem("token", storedToken);
        }
      }
    } else {
      setLoggedInUser(null);
      setUser(null);
      setPermissions([]);
      sessionStorage.clear();
    }
  }, []);

  const handleMenuClick = (menuName) => {
    setTitle(menuName);
  };

  const handleLogin = (userData, rememberMe, token) => {
    setLoggedInUser(userData.username);
    setUser(userData);
    setPermissions(userData.permissions || []);

    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("username", userData.username);
    sessionStorage.setItem("token", token);
    localStorage.setItem("uid", JSON.stringify(userData.uid));

    if (rememberMe) {
      // Nếu "Ghi nhớ đăng nhập", lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("username", userData.username);
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("token", token);
    } else {
      // Nếu không "Ghi nhớ", xóa dữ liệu trong localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("token");
      localStorage.setItem("rememberMe", "false");
    }

    localStorage.removeItem("isLoggedOut");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUser(null);
    setPermissions([]);

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");

    localStorage.removeItem("user");
    localStorage.removeItem("password");
    localStorage.removeItem("uid");
    localStorage.removeItem("token");
    // Nếu không có rememberMe, xóa dữ liệu trong localStorage
    if (!JSON.parse(localStorage.getItem("rememberMe"))) {
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("password");
      localStorage.removeItem("uid");
      localStorage.removeItem("token");
    }

    localStorage.setItem("isLoggedOut", "true");
  };

  return (
    <div className="App">
      <Router>
        <AppRouter
          user={user}
          title={title}
          loggedInUser={loggedInUser}
          permissions={permissions}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleMenuClick={handleMenuClick}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
      </Router>
    </div>
  );
}

export default App;
