import React, { useEffect, useState } from "react"; // Đảm bảo đã import React, useEffect, useState
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import url from "../../Global/ipconfixad";
import ApiService from "../../services/ApiCaller";

const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return "0 VND";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupBy, setGroupBy] = useState("day"); // 'day', 'month', 'year'

  const fetchRevenueData = async () => {
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
        group_by: groupBy,
      };

      const response = await ApiService.get(
        `${url}apihm/Admin/Statistical/get_total_amount.php`,
        { params }
      );
      if (response.data.success) {
        const processedData = response.data.data.map((item) => ({
          ...item,

          total_online: parseFloat(item.total_online || 0),
          total_offline: parseFloat(item.total_offline || 0),
          total:
            parseFloat(item.total_online || 0) +
            parseFloat(item.total_offline || 0),
        }));
        setRevenueData(processedData);
      } else {
        console.error("Error fetching revenue data:", response.data.message);
        setRevenueData([]); // Xóa dữ liệu nếu có lỗi
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setRevenueData([]); // Xóa dữ liệu nếu có lỗi
    }
  };

  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []);

  // Gọi API khi startDate, endDate hoặc groupBy thay đổi
  useEffect(() => {
    if (startDate && endDate) {
      fetchRevenueData();
    }
  }, [startDate, endDate, groupBy]);

  const xAxisTickFormatter = (value) => {
    const stringValue = String(value);

    if (groupBy === "day") {
      const parts = stringValue.split("-");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}`; // Hiển thị DD-MM cho ngày (ví dụ: 24-04)
      }
    } else if (groupBy === "month") {
      const parts = stringValue.split("-");
      if (parts.length === 2) {
        return `${parts[1]}-${parts[0]}`; // Hiển thị MM-YYYY cho tháng (ví dụ: 04-2025)
      }
    } else if (groupBy === "year") {
      return stringValue; // Chỉ hiển thị năm (ví dụ: 2024)
    }
    return stringValue;
  };

  const xAxisDataKey = "payment_date_formatted";

  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        bgcolor: "#ffffff",
        boxShadow: 1,
        mt: 3, // Margin top để tạo khoảng cách với các phần khác
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: "#333" }}>
        Biểu đồ doanh thu
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

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={revenueData}
          margin={{
            top: 10,
            right: 30,
            left: 60,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xAxisDataKey} tickFormatter={xAxisTickFormatter} />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Bar
            dataKey="total_online"
            stackId="revenue"
            fill="#fa0202"
            name="Doanh thu Online"
            color=""
          />
          <Bar
            dataKey="total_offline"
            stackId="revenue"
            fill="#2196F3"
            name="Doanh thu Trực tiếp"
          />
          {/* LabelList cho tổng doanh thu trên mỗi cột */}
          <LabelList
            dataKey="total" // Hiển thị tổng doanh thu (online + offline)
            position="top"
            formatter={formatCurrency}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RevenueChart;
