// Sidebar.js
import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import "./sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";

import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import PersonIcon from "@mui/icons-material/Person";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import PaidIcon from "@mui/icons-material/Paid";
import CommentIcon from "@mui/icons-material/Comment";
import { Link, useLocation } from "react-router-dom";
import img from "../../Assets/images/logo-ct.png";

const Sidebar = ({ onMenuClick, isSidebarOpen, permissions }) => {
  const location = useLocation();

  const items = [
    {
      text: "Tổng quan",
      icon: <DashboardIcon />,
      link: "/",
      permission: "dashboard",
    },
    {
      text: "Tài khoản",
      icon: <PersonIcon />,
      link: "/account",
      permission: "account",
    },
    {
      text: "Dịch vụ",
      icon: <RoomServiceIcon />,
      link: "/service",
      permission: "service",
    },
    {
      text: "Gara",
      icon: <MapsHomeWorkIcon />,
      link: "/center",
      permission: "center",
    },
    {
      text: "Lịch hẹn",
      icon: <CalendarMonthIcon />,
      link: "/appointment",
      permission: "appointment",
    },
    {
      text: "Hóa đơn",
      icon: <PaidIcon />,
      link: "/payment",
      permission: "payment",
    },
    {
      text: "Bình luận",
      icon: <CommentIcon />,
      link: "/review",
      permission: "review",
    },
  ];

  return (
    <Drawer
      classes={{ paper: "sidebar-container" }}
      variant="permanent"
      sx={{
        width: isSidebarOpen ? 220 : 70,
        flexShrink: 0,
        whiteSpace: "nowrap",
        transition: "width 0.3s",
        "& .MuiDrawer-paper": {
          width: isSidebarOpen ? 220 : 70,
          overflowX: "hidden",
          transition: "width 0.3s",
          backgroundColor: "#1e2023",
          color: "#fff",
        },
      }}
    >
      {/* logo */}
      <div className="sidebar-logo">
        <span
          style={{ display: isSidebarOpen ? "block" : "none" }}
          className="dashboard-text"
        >
          Dashboard
        </span>
        <img
          src={img}
          alt="Logo"
          className="logo-image"
          style={{
            width: isSidebarOpen ? "53px" : "25px",
            transition: "width 0.3s",
          }}
        />
      </div>
      <List className="siderbar">
        {items.map(
          (item, index) =>
            // Chỉ hiển thị menu mà người dùng có quyền truy cập
            permissions &&
            permissions.includes(item.permission) && (
              <ListItem
                button
                component={Link}
                to={item.link}
                key={index}
                className={`sidebar-item ${
                  location.pathname === item.link ? "active" : ""
                }`}
                onClick={() => onMenuClick(item.text)}
                sx={{
                  display: "flex",
                  justifyContent: isSidebarOpen ? "flex-start" : "center",
                  px: 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isSidebarOpen ? 2 : "auto",
                    color: "inherit",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {/* Ẩn/Hiện text theo trạng thái sidebar */}
                {isSidebarOpen && <ListItemText primary={item.text} />}
              </ListItem>
            )
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
