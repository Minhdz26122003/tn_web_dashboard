import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../Components/sidebar/sidebar";
import TopBar from "../Components/topbar/topbar";
import Dashboard from "../Pages/Dashboard/Dashboard.js";
import Account from "../Pages/Account/Account";
import Service from "../Pages/Service/service.js";
import Center from "../Pages/Centers/centers";
import Appointment from "../Pages/Appointment/Appointment";
import Profile from "../Pages/Profile/profile";
import Login from "../Pages//Login/Login";
import Sercen from "../Pages/Ser-Cen/ServiceCen";
import Payment from "../Pages/Payment/Payment";
import Review from "../Pages/Review/Review";
import Unauthorized from "../Components/unauthorized.js";

const PrivateRoute = ({ element, loggedInUser }) => {
  return loggedInUser ? element : <Navigate to="/login" />;
};

const AppRouter = ({
  user,
  title,
  loggedInUser,
  permissions,
  isSidebarOpen,
  toggleSidebar,
  handleMenuClick,
  handleLogin,
  handleLogout,
}) => {
  if (loggedInUser) {
    // Đã đăng nhập => render layout chính
    return (
      <div className="AppGlass">
        <Sidebar
          onMenuClick={handleMenuClick}
          isSidebarOpen={isSidebarOpen}
          permissions={permissions}
        />
        <TopBar
          username={loggedInUser}
          onLogout={handleLogout}
          title={title}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          userRole={user?.status}
        />
        <Box
          component="main"
          sx={{
            marginLeft: isSidebarOpen ? "120px" : "0px",
            transition: "margin-left 0.5s",
            p: 2,
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute
                  loggedInUser={loggedInUser}
                  element={<Dashboard />}
                />
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute
                  loggedInUser={loggedInUser}
                  element={<Account />}
                />
              }
            />
            <Route
              path="/service"
              element={
                <PrivateRoute
                  loggedInUser={loggedInUser}
                  element={<Service />}
                />
              }
            />
            <Route
              path="/center"
              element={
                <PrivateRoute
                  loggedInUser={loggedInUser}
                  element={<Center />}
                />
              }
            />
            <Route
              path="/sercen"
              element={
                <PrivateRoute
                  loggedInUser={loggedInUser}
                  element={<Sercen />}
                />
              }
            />
            <Route
              path="/appointment"
              element={
                <PrivateRoute
                  loggedInUser={loggedInUser}
                  element={<Appointment />}
                />
              }
            />
            <Route
              path="/payment"
              element={
                <PrivateRoute
                  loggedInUser={loggedInUser}
                  element={<Payment />}
                />
              }
            />
            <Route
              path="/review"
              element={
                <PrivateRoute
                  loggedInUser={loggedInUser}
                  element={<Review />}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute
                  loggedInUser={loggedInUser}
                  element={<Profile user={user} />}
                />
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
            {/* Khi đã đăng nhập, truy cập /login sẽ chuyển về trang chủ */}
            <Route path="/login" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </div>
    );
  } else {
    // Chưa đăng nhập => chỉ render trang Login
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
};

export default AppRouter;
