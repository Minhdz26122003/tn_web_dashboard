// Dashboard.js
import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

import axios from "axios";
import "./dashboard.css";
import url from "../../Global/ipconfixad";
import ApiService from "../../services/ApiCaller";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

import AppointmentFlow from "./AppointmentFlow";
import TotalAppointChart from "./TotalAppointChart";
import RevenueChart from "./RevenueChart";
import AccessoryRevenueChart from "./AccessoryRevenueChart";

const Dashboard = () => {
  const [user, setTotalUsers] = useState(0);
  const [service, setTotalServices] = useState(0);
  const [appointments, setTotalApps] = useState(0);
  const [revenue, setTotalRevenue] = useState(0);
  const [car, setTotalCar] = useState(0);
  const [appointStatusFlows, setAppointStatusFlows] = useState(null);

  useEffect(() => {
    fetchCar();
    fetchUser();
    fetchService();
    fetchAppointment();
    fetchRenvenue();
    fetchAppointFlows();
  }, []);

  // só người dùng
  const fetchUser = async () => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Statistical/card_total_user.php`
      );
      if (response.data.success) {
        setTotalUsers(response.data.total_user);
      }
    } catch (error) {
      console.error("Error fetching user statistics:", error);
    }
  };

  // số dịch vụ
  const fetchService = async () => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Statistical/card_total_service.php`
      );
      console.log(
        "apihm/Admin/Statistical/card_total_revenue.php",
        response.data
      );
      if (response.data.success) {
        setTotalServices(response.data.total_service);
      }
    } catch (error) {
      console.error("Error fetching service statistics:", error);
    }
  };
  // số lịch hẹn
  const fetchAppointment = async () => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Statistical/card_total_appoint.php`
      );
      if (response.data.success) {
        setTotalApps(response.data.total_appoi);
      }
    } catch (error) {
      console.error("Error fetching appointment statistics:", error);
    }
  };
  // số xe
  const fetchCar = async () => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Statistical/card_total_car.php`
      );
      if (response.data.success) {
        setTotalCar(response.data.total_car);
      }
    } catch (error) {
      console.error("Error fetching car statistics:", error);
    }
  };
  // doanh thu
  const fetchRenvenue = async () => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Statistical/card_total_revenue.php`
      );

      if (response.data.success) {
        setTotalRevenue(response.data.total_revenue);
      }
    } catch (error) {
      console.error("Error fetching doanh thu :", error);
    }
  };

  // Hàm lấy dữ liệu luồng lịch hẹn
  const fetchAppointFlows = async () => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Statistical/get_appoint_status.php`
      );
      if (response.data.success) {
        setAppointStatusFlows(response.data.data);
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
      <div className="cards-container">
        {/* Card: All Earnings */}
        <Card className="card earning">
          <CardContent className="card-content-top">
            <Box className="text-section">
              <Typography variant="h5" className="value">
                {formatCurrency(revenue)}
              </Typography>
              <Typography variant="body2" className="title">
                Doanh thu
              </Typography>
            </Box>
            <AttachMoneyIcon className="icon-wrapper" />
          </CardContent>
          <div className="card-footer">
            <Typography variant="body2">Số doanh thu</Typography>
            <TrendingUpIcon className="chart-icon" /> {/* Biểu tượng biểu đồ */}
          </div>
        </Card>

        {/* Card: appointment */}
        <Card className="card appointment">
          <CardContent className="card-content-top">
            <Box className="text-section">
              <Typography variant="h5" className="value">
                {appointments}
              </Typography>
              <Typography variant="body2" className="title">
                Lịch hẹn
              </Typography>
            </Box>
            <CalendarTodayIcon className="icon-wrapper" />
          </CardContent>
          <div className="card-footer">
            <Typography variant="body2">Tổng số lịch hẹn</Typography>
            <TrendingUpIcon className="chart-icon" />
          </div>
        </Card>

        {/* Card: Page service  */}
        <Card className="card service">
          <CardContent className="card-content-top">
            <Box className="text-section">
              <Typography variant="h5" className="value">
                {service}
              </Typography>
              <Typography variant="body2" className="title">
                Dịch vụ
              </Typography>
            </Box>
            <DescriptionIcon className="icon-wrapper" />
          </CardContent>
          <div className="card-footer">
            <Typography variant="body2">Tổng số dịch vụ</Typography>
            <TrendingUpIcon className="chart-icon" />
          </div>
        </Card>

        {/* Card: user */}
        <Card className="card user">
          <CardContent className="card-content-top">
            <Box className="text-section">
              <Typography variant="h5" className="value">
                {user}
              </Typography>
              <Typography variant="body2" className="title">
                Người dùng
              </Typography>
            </Box>
            <PersonIcon className="icon-wrapper" />
          </CardContent>
          <div className="card-footer">
            <Typography variant="body2">Số người dùng hệ thống</Typography>
            <TrendingUpIcon className="chart-icon" />
          </div>
        </Card>

        {/* Card: car */}
        <Card className="card car">
          <CardContent className="card-content-top">
            <Box className="text-section">
              <Typography variant="h5" className="value">
                {car}
              </Typography>
              <Typography variant="body2" className="title">
                Xe
              </Typography>
            </Box>
            <DirectionsCarIcon className="icon-wrapper" />
          </CardContent>
          <div className="card-footer">
            <Typography variant="body2">Số xe đã phục vụ</Typography>
            <TrendingUpIcon className="chart-icon" />
          </div>
        </Card>
      </div>

      <div className="flow-container">
        {appointStatusFlows ? (
          <AppointmentFlow statusCounts={appointStatusFlows} />
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
