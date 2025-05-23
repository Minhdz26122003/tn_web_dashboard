import React, { useEffect, useState } from "react";
import {
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  TextField,
} from "@mui/material";
import {
  BarChart, // Chọn BarChart để dễ so sánh giữa các kỳ
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import axios from "axios";
import url from "../../Global/ipconfixad";
import ApiService from "../../services/ApiCaller";

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return "0 VND";
  }
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) {
    return "0 VND";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numericValue);
};

const AccessoryRevenueChart = () => {
  const [accessoryRevenueData, setAccessoryRevenueData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupBy, setGroupBy] = useState("day");

  const fetchAccessoryRevenue = async () => {
    try {
      const apiUrl = `${url}apihm/Admin/Statistical/get_amount_access.php`;
      const params = {
        start_date: startDate,
        end_date: endDate,
        group_by: groupBy,
      };

      const response = await ApiService.get(apiUrl, { params });
      if (response.data.success) {
        setAccessoryRevenueData(response.data.data);
      } else {
        console.error(
          "Error fetching accessory revenue:",
          response.data.message
        );
        setAccessoryRevenueData([]);
      }
    } catch (error) {
      console.error("Error fetching accessory revenue:", error);
      setAccessoryRevenueData([]);
    }
  };

  useEffect(() => {
    // Đặt ngày mặc định (ví dụ: 30 ngày gần nhất)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchAccessoryRevenue();
    }
  }, [startDate, endDate, groupBy]);

  // Hàm để định dạng trục X dựa trên kiểu nhóm
  const xAxisTickFormatter = (value) => {
    const stringValue = String(value);

    if (groupBy === "day") {
      const parts = stringValue.split("-");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}`; // DD-MM
      }
    } else if (groupBy === "month") {
      const parts = stringValue.split("-");
      if (parts.length === 2) {
        return `${parts[1]}-${parts[0]}`; // MM-YYYY
      }
    } else if (groupBy === "year") {
      return stringValue; // YYYY
    }
    return stringValue;
  };

  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        bgcolor: "#ffffff",
        boxShadow: 1,
        mt: 3,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: "#333" }}>
        Biểu đồ doanh thu phụ tùng
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <TextField
          label="Ngày bắt đầu"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />
        <TextField
          label="Ngày kết thúc"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Nhóm theo</InputLabel>
          <Select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            label="Nhóm theo"
          >
            <MenuItem value="day">Ngày</MenuItem>
            <MenuItem value="month">Tháng</MenuItem>
            <MenuItem value="year">Năm</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={accessoryRevenueData}
          margin={{
            top: 20,
            right: 30,
            left: 60, // Tăng left margin để nhãn trục Y không bị che
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time_period" tickFormatter={xAxisTickFormatter} />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Bar
            dataKey="total_accessory_revenue"
            fill="#82ca9d" // Màu xanh lá cây cho doanh thu phụ tùng
            name="Doanh thu phụ tùng"
          >
            <LabelList
              dataKey="total_accessory_revenue"
              position="top"
              formatter={formatCurrency}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AccessoryRevenueChart;
