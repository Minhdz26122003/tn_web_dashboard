// Dashboard.js
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  TextField, // Import TextField cho DatePicker
  Button, // Import Button
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  LabelList,
  AreaChart, // Đảm bảo AreaChart đã được import nếu bạn vẫn dùng
} from "recharts";

import axios from "axios";
import "./dashboard.css";
import url from "../../Global/ipconfixad";
import ApiService from "../../services/ApiCaller";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import AppointmentFlow from "./AppointmentFlow";
import TotalAppointChart from "./TotalAppointChart";
import RevenueChart from "./RevenueChart";
import AccessoryRevenueChart from "./AccessoryRevenueChart";

const Dashboard = () => {
  const [month, setMonth] = useState(12);
  const [year, setYear] = useState(2024);
  const [user, setTotalUsers] = useState(0);
  const [service, setTotalServices] = useState(0);
  const [appointments, setTotalApps] = useState(0);
  const [price, setPrice] = useState(0);
  const [datamonth, setDataMonth] = useState([]);
  const [datayear, setDataYear] = useState([]);
  const [revenue, setRevenue] = useState([]);

  const [appointmentStatusCounts, setAppointmentStatusCounts] = useState(null);

  useEffect(() => {
    TkeMonth();
    TkeYear();
    TkeDthu();
    fetchUser();
    fetchService();
    fetchAppointment();
    fetchRenvenue();
    fetchAppointmentStatusCounts();
  }, [month, year]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${url}myapi/Thongke/tkenguoidung.php`);
      if (response.data.success) {
        setTotalUsers(response.data.total_user);
      }
    } catch (error) {
      console.error("Error fetching user statistics:", error);
    }
  };
  const fetchService = async () => {
    try {
      const response = await axios.get(`${url}myapi/Thongke/tkedichvu.php`);
      if (response.data.success) {
        setTotalServices(response.data.total_services);
      }
    } catch (error) {
      console.error("Error fetching service statistics:", error);
    }
  };
  const fetchAppointment = async () => {
    try {
      const response = await axios.get(`${url}myapi/Thongke/tkelichhen.php?`);
      if (response.data.success) {
        setTotalApps(response.data.solich);
      }
    } catch (error) {
      console.error("Error fetching appointment statistics:", error);
    }
  };
  const fetchRenvenue = async () => {
    try {
      const response = await axios.get(
        `${url}myapi/Thongke/tkedoanhthusort.php`
      );
      console.log(response.data);
      if (response.data.success) {
        setPrice(response.data.doanhthu);
      }
    } catch (error) {
      console.error("Error fetching doanh thu :", error);
    }
  };

  const TkeMonth = async () => {
    try {
      const response = await axios.get(
        `${url}myapi/Thongke/tkelichhenthang.php?month=${month}&year=${year}`
      );
      if (response.data.success) {
        const chartData = response.data.statistics.daily_appointments.map(
          (item) => ({
            appointment_date: item.appointment_date,
            appointments: parseInt(item.daily_appointments, 10),

            total_daily_appointments: parseInt(item.daily_appointments, 10),
            total_user: parseInt(item.total_users, 10),
            total_appoinments: parseInt(item.total_appointments, 10),
          })
        );
        setDataMonth(chartData);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };
  const TkeYear = async () => {
    try {
      const response = await axios.get(
        `${url}myapi/Thongke/tkelichhennam.php?&year=${year}`
      );
      if (response.data.success) {
        const chartDatas = response.data.statistics.monthly_appointments.map(
          (item) => ({
            appointment_month: item.appointment_month,
            total_appoinments_month: parseInt(item.total_appointments, 10),
          })
        );
        setDataYear(chartDatas);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };
  const TkeDthu = async () => {
    try {
      const response = await axios.get(
        `${url}myapi/Thongke/tkedoanhthu.php?&year=${year}`
      );
      //console.log("API response:", response.data);

      if (
        response.data.success &&
        Array.isArray(response.data.statistics?.monthly_revenue)
      ) {
        const chartDatas2 = response.data.statistics.monthly_revenue.map(
          (item) => ({
            pay_month: item.pay_month, // Tháng
            total_revenue: parseFloat(item.total_revenue), // Doanh thu
          })
        );
        setRevenue(chartDatas2);
      } else {
        console.error(
          "Invalid data structure or empty monthly_revenue:",
          response.data
        );
        setRevenue([]);
      }
    } catch (error) {
      console.error("Error fetching revenue:", error);
      setRevenue([]);
    }
  };

  const fetchAppointmentStatusCounts = async () => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Statistical/get_appointment_status_counts.php`
      );
      if (response.data.success) {
        setAppointmentStatusCounts(response.data.data);
      } else {
        console.error(
          "Error fetching appointment status counts:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching appointment status counts:", error);
    }
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="dashboard-container">
      {/* Container for cards */}
      <div className="cards-container">
        {/* Card: All Earnings */}
        <Card className="card earning">
          <CardContent className="card-content-top">
            <Box className="text-section">
              <Typography variant="h5" className="value">
                {formatCurrency(price)}
              </Typography>
              <Typography variant="body2" className="title">
                All Earnings
              </Typography>
            </Box>
            <AttachMoneyIcon className="icon-wrapper" />
          </CardContent>
          <div className="card-footer">
            <Typography variant="body2">10% changes on profit</Typography>
            <TrendingUpIcon className="chart-icon" /> {/* Biểu tượng biểu đồ */}
          </div>
        </Card>

        {/* Card: Task */}
        <Card className="card task">
          <CardContent className="card-content-top">
            <Box className="text-section">
              <Typography variant="h5" className="value">
                {appointments}
              </Typography>
              <Typography variant="body2" className="title">
                Task
              </Typography>
            </Box>
            <CalendarTodayIcon className="icon-wrapper" />
          </CardContent>
          <div className="card-footer">
            <Typography variant="body2">28% task performance</Typography>
            <TrendingUpIcon className="chart-icon" />
          </div>
        </Card>

        {/* Card: Page Views */}
        <Card className="card page-views">
          <CardContent className="card-content-top">
            <Box className="text-section">
              <Typography variant="h5" className="value">
                {user}+
              </Typography>
              <Typography variant="body2" className="title">
                Page Views
              </Typography>
            </Box>
            <DescriptionIcon className="icon-wrapper" />
          </CardContent>
          <div className="card-footer">
            <Typography variant="body2">10k daily views</Typography>
            <TrendingUpIcon className="chart-icon" />
          </div>
        </Card>

        {/* Card: Downloads */}
        <Card className="card downloads">
          <CardContent className="card-content-top">
            <Box className="text-section">
              <Typography variant="h5" className="value">
                {service}
              </Typography>
              <Typography variant="body2" className="title">
                Downloads
              </Typography>
            </Box>
            <ThumbUpAltIcon className="icon-wrapper" />
          </CardContent>
          <div className="card-footer">
            <Typography variant="body2">1k download in App store</Typography>
            <TrendingUpIcon className="chart-icon" />
          </div>
        </Card>
      </div>
      <div className="flow-container">
        {appointmentStatusCounts ? (
          <AppointmentFlow statusCounts={appointmentStatusCounts} />
        ) : (
          <Typography>Đang tải dữ liệu luồng...</Typography>
        )}
      </div>

      {/* Biểu đồ doanh thu (RevenueChart) */}
      <RevenueChart />

      {/* Biểu đồ số lượng đặt lịch  (AppointmentChart) */}
      <TotalAppointChart />

      {/* Biểu đồ doanh thu phụ tùng (AccessoryRevenueChart) */}
      <AccessoryRevenueChart />
    </div>
  );
};

export default Dashboard;
