import { useState, useEffect } from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import ApiService from "../../services/ApiCaller";
import PaymentModel from "../../Model/Payment/PaymentModel";

const PaymentController = (url) => {
  const [invoices, setInvoices] = useState([]);
  const [value, setValue] = useState(0); // 0: All, 1: Unpaid, 2: Paid, 3: Offline, 4: Online
  const [startDate, setStartDate] = useState("");
  const [message, setMessage] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [settlementOpen, setSettlementOpen] = useState(false);
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const [formCounts, setFormCounts] = useState({
    all: 0,
    unpaid: 0,
    paid: 0,
    offline: 0,
    online: 0,
  });
  const [totalInvoice, setTotalInvoice] = useState(0);

  const fetchInvoices = async (
    page = pagination.currentPage,
    limit = pagination.limit,
    status = value
  ) => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Payment/get_payment.php`,
        {
          params: { page, limit, status },
        }
      );
      const { success, data: items, pagination, counts } = response.data;
      if (!success || !Array.isArray(items)) {
        setInvoices([]);
        setTotalInvoice(0);
        return;
      }
      +(
        // set số liệu thống kê
        setFormCounts({
          all: counts.all,
          unpaid: counts.unpaid,
          paid: counts.paid,
          offline: counts.paid_offline,
          online: counts.paid_online,
        })
      );
      // map về model và set data
      const pay = items.map((app) => new PaymentModel(app));
      setTotalInvoice(pagination.totalItems);
      setInvoices(pay);
      setPagination({
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        limit: pagination.limit,
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setTotalInvoice(0);
    }
  };

  // hàm để mở modal kèm appointmentId
  const openSettlement = (appointmentId) => {
    setCurrentAppointmentId(appointmentId);
    setSettlementOpen(true);
  };
  // hàm đóng đơn giản
  const closeSettlement = () => {
    setSettlementOpen(false);
    setCurrentAppointmentId(null);
  };
  // Tìm kiếm
  const searchInvoices = async (start, end) => {
    if (!start || !end) return;
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Payment/search_payment.php`,
        { params: { start_date: start, end_date: end } }
      );
      if (response.data.success) {
        setInvoices(response.data.payments.map((inv) => new PaymentModel(inv)));
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error("Error searching invoices:", error);
    }
  };

  const handlePageChange = (event, page) => {
    fetchInvoices(page, pagination.limit, value);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    fetchInvoices(1, pagination.limit, newValue);
  };

  useEffect(() => {
    if (startDate && endDate) searchInvoices(startDate, endDate);
    else fetchInvoices();
  }, [startDate, endDate, value]);

  const formatPrice = (amount) => {
    const num =
      typeof amount === "string"
        ? parseInt(amount.replace(/\D/g, ""), 10)
        : amount;
    return num.toLocaleString("vi-VN");
  };

  return {
    invoices,
    startDate,
    endDate,
    pagination,
    value,
    message,
    fetchInvoices,
    setMessage,
    settlementOpen,
    currentAppointmentId,
    openSettlement,
    closeSettlement,
    openSnackbar,
    setOpenSnackbar,
    formCounts,
    totalInvoice,
    setStartDate,
    setEndDate,
    handlePageChange,
    handleTabChange,
    formatPrice,
  };
};

export default PaymentController;
