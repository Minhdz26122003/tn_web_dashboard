import { useState, useEffect } from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import ApiService from "../../services/ApiCaller";
import PaymentModel from "../../Model/Payment/PaymentModel";
const PaymentController = (url) => {
  const [payments, setPayment] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  useEffect(() => {
    fetchPayments();
  }, []);
  const fetchPayments = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const response = await ApiService.get(
        `${url}myapi/Thanhtoan/gethoadon.php`,
        {
          params: { page, limit },
        }
      );
      const data = response.data;
      if (data && Array.isArray(data.data)) {
        const pay_data = data.data.map((pay) => new PaymentModel({ ...pay }));
        setPayment(pay_data);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          limit,
        });
      } else {
        setPayment([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải hoá đơn :", error);
    }
  };

  //TÌM KIẾM HÓA ĐƠN
  const searchPayments = async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        console.error("Ngày bắt đầu và kết thúc không hợp lệ.");
        return;
      }
      const response = await ApiService.get(
        `${url}myapi/Thanhtoan/tkhoadon.php?start_date=${startDate}&end_date=${endDate}`
      );
      if (response.data.success) {
        const pay_data = (response.data.payments || []).map(
          (app) => new PaymentModel({ ...app })
        );
        setPayment(pay_data);
      } else {
        setPayment([]);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm hóa đơn:", error);
    }
  };
  const handlePageChange = (event, value) => {
    fetchPayments(value, pagination.limit);
  };
  useEffect(() => {
    if (startDate && endDate) {
      searchPayments(startDate, endDate);
    } else {
      fetchPayments();
    }
  }, [startDate, endDate]);

  const formatPrice = (giatri) => {
    if (!giatri) return "0";
    const numericValue =
      typeof giatri === "string"
        ? parseInt(giatri.replace(/\D/g, ""), 10)
        : giatri;
    return numericValue.toLocaleString("vi-VN");
  };
  return {
    payments,
    selectedPayment,
    searchTerm,
    openAdd,
    endDate,
    startDate,
    pagination,
    setSelectedPayment,
    setStartDate,
    setSearchTerm,
    setEndDate,
    handlePageChange,
    setPagination,
    formatPrice,
    setPayment,
    setSearchTerm,
  };
};
export default PaymentController;
