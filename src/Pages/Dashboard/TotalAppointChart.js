import React, { useEffect, useState } from "react";
import {
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  TextField, // Cho DatePicker
} from "@mui/material";
import {
  AreaChart,
  Area,
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
const formatCount = (value) => {
  return parseInt(value).toLocaleString("vi-VN");
};

const TotalAppointmentChart = () => {
  const [appointmentCountsData, setAppointmentCountsData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupBy, setGroupBy] = useState("day");
  const fetchAppointmentCounts = async () => {
    try {
      const apiUrl = `${url}apihm/Admin/Statistical/get_total_appointment.php`;
      const params = {
        start_date: startDate,
        end_date: endDate,
        group_by: groupBy,
      };

      const response = await ApiService.get(apiUrl, { params });
      if (response.data.success) {
        setAppointmentCountsData(response.data.data);
      } else {
        console.error(
          "Error fetching appointment counts:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching appointment counts:", error);
    }
  };

  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]); // YYYY-MM-DD
    setEndDate(today.toISOString().split("T")[0]); // YYYY-MM-DD
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchAppointmentCounts();
    }
  }, [startDate, endDate, groupBy]);

  const xAxisTickFormatter = (value) => {
    // Chuyển đổi giá trị sang chuỗi để đảm bảo .split() hoạt động
    const stringValue = String(value);

    if (groupBy === "day") {
      const parts = stringValue.split("-");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}`;
      }
    } else if (groupBy === "month") {
      // YYYY-MM" -> "MM-YYYY"
      const parts = stringValue.split("-");
      if (parts.length === 2) {
        return `${parts[1]}-${parts[0]}`; // Ví dụ: "04-2025"
      }
    } else if (groupBy === "year") {
      // "YYYY"
      return stringValue; // Chỉ hiển thị năm
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
        Biểu đồ số lượng lịch hẹn
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
        <AreaChart
          data={appointmentCountsData}
          margin={{
            top: 20,
            right: 30,
            left: 20, // Có thể điều chỉnh nếu nhãn trục Y quá dài
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time_period" tickFormatter={xAxisTickFormatter} />
          <YAxis allowDecimals={false} tickFormatter={formatCount} />
          <Tooltip formatter={(value) => formatCount(value)} />
          <Legend />
          <Area
            type="monotone"
            dataKey="total_appointments"
            stroke="#8884d8"
            fill="#8884d8" // Màu sắc tương tự biểu đồ doanh thu
            name="Tổng số lịch hẹn"
          >
            <LabelList
              dataKey="total_appointments"
              position="top"
              formatter={formatCount}
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};
export default TotalAppointmentChart;
