import React, { useEffect, useState } from "react"; // Đảm bảo đã import React, useEffect, useState
import {
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  TextField, // Import TextField cho DatePicker
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
import ApiService from "../../services/ApiCaller"; // Đảm bảo đường dẫn này đúng

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return "0 VND"; // Xử lý giá trị null/undefined
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// --- Component Biểu đồ Doanh thu Thanh toán (Online/Offline) ---
const RevenueChart = () => {
  // Loại bỏ prop `baseUrl` vì `url` đã được import trực tiếp
  const [revenueData, setRevenueData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupBy, setGroupBy] = useState("day"); // 'day', 'month', 'year'

  // Fetch data
  const fetchRevenueData = async () => {
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
        group_by: groupBy,
      };
      // Đảm bảo URL API là đúng
      const response = await ApiService.get(
        `${url}apihm/Admin/Statistical/get_total_amount.php`, // Giả sử đây là API doanh thu mới của bạn
        { params }
      );
      if (response.data.success) {
        // Xử lý dữ liệu để thêm trường 'total' cho LabelList
        const processedData = response.data.data.map((item) => ({
          ...item,
          // Đảm bảo item.total_online và item.total_offline là số
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

  // Thiết lập ngày mặc định khi component được mount lần đầu
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []); // Chỉ chạy một lần khi mount

  // Gọi API khi startDate, endDate hoặc groupBy thay đổi
  useEffect(() => {
    if (startDate && endDate) {
      // Chỉ fetch khi có đủ ngày bắt đầu và kết thúc
      fetchRevenueData();
    }
  }, [startDate, endDate, groupBy]);

  // Hàm để định dạng trục X dựa trên kiểu nhóm
  const xAxisTickFormatter = (value) => {
    const stringValue = String(value); // Đảm bảo giá trị là chuỗi

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
    return stringValue; // Trả về giá trị gốc nếu không khớp định dạng
  };

  // Lựa chọn dataKey cho XAxis dựa trên groupBy
  // API của bạn trả về `time_period` bất kể groupBy là gì
  const xAxisDataKey = "time_period";

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
        Biểu đồ doanh thu theo thời gian
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
            top: 20,
            right: 30,
            left: 60, // Tăng left margin để nhãn trục Y không bị che
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
            fill="#4CAF50" // Màu xanh lá cây cho Online
            name="Doanh thu Online"
          />
          <Bar
            dataKey="total_offline"
            stackId="revenue"
            fill="#2196F3" // Màu xanh dương cho Trực tiếp
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
