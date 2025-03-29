import { useState, useEffect } from "react";
import axios from "axios";

const AppointmentController = (url) => {
  const [appointments, setAppointments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });

  // Hàm lấy danh sách lịch hẹn
  const fetchAppointments = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const response = await axios.get(
        `${url}apihm/Admin/Appointment/get_book.php`,
        {
          params: { page, limit },
        }
      );
      const data = response.data;
      if (data && Array.isArray(data.data)) {
        setAppointments(data.data);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          limit,
        });
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch hẹn:", error);
    }
  };

  // Hàm tìm kiếm lịch hẹn theo ngày
  const searchAppointments = async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        console.error("Ngày bắt đầu và kết thúc không hợp lệ.");
        return;
      }
      const response = await axios.get(
        `${url}myapi/Lichhen/tkLichhen.php?start_date=${startDate}&end_date=${endDate}`
      );
      if (response.data.success) {
        setAppointments(response.data.appointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm lịch hẹn:", error);
    }
  };

  const handlePageChange = (event, value) => {
    fetchAppointments(value, pagination.limit);
  };
  useEffect(() => {
    if (startDate && endDate) {
      searchAppointments(startDate, endDate);
    } else {
      fetchAppointments();
    }
  }, [startDate, endDate]);

  // Hàm chuyển đổi trạng thái lịch hẹn thành chữ
  const convertTrangThai = (trangThai) => {
    const trangThaiMap = {
      0: "Chờ xác nhận",
      1: "Đang thực hiện",
      2: "Hoàn thành",
      3: "Đã thanh toán",
      4: "Đã hủy",
    };
    return trangThaiMap[trangThai] || "Không xác định";
  };

  // Xử lý trạng thái nút hành động
  const btnStatus = (trangThai) => {
    switch (trangThai) {
      case 0:
        return { confirm: true, cancel: true, action: "confirm" };
      case 1:
        return { confirm: true, cancel: false, action: "complete" };
      case 2:
        return { confirm: true, cancel: false, action: "payment" };
      case 3:
      case 4:
        return { confirm: false, cancel: false, action: null };
      default:
        return { confirm: false, cancel: false, action: null };
    }
  };

  // Hủy lịch hẹn
  const cancelAppointment = async (idlichhen, lyDo) => {
    try {
      const response = await axios.post(`${url}myapi/Lichhen/huylichhen.php`, {
        idlichhen,
        lydohuy: lyDo,
      });

      if (response.data.success) {
        setMessage("Lịch hẹn đã được hủy!");
        setOpenSnackbar(true);

        fetchAppointments();
        setIsModalVisible(false);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
        console.log(
          "Lỗi",
          response.data.message || "Hủy lịch không thành công."
        );
      }
    } catch (error) {
      console.error(error);
      console.log("Lỗi", "Không thể kết nối với máy chủ.");
    }
  };

  // Xác nhận lịch hẹn
  const confirmAppointment = async (id) => {
    try {
      await axios.post(`${url}myapi/Lichhen/xacnhanLh.php`, { idlichhen: id });
      fetchAppointments();
    } catch (error) {
      console.error("Lỗi xác nhận lịch hẹn:", error);
    }
  };

  // Hoàn thành lịch hẹn
  const completeAppointment = async (id) => {
    try {
      await axios.post(`${url}myapi/Lichhen/hoanthanhLh.php`, {
        idlichhen: id,
      });
      fetchAppointments();
    } catch (error) {
      console.error("Lỗi hoàn thành lịch hẹn:", error);
    }
  };

  // Thanh toán lịch hẹn
  const payAppointment = async (id) => {
    try {
      await axios.post(`${url}myapi/Lichhen/thanhtoanLh.php`, {
        idlichhen: id,
      });
      fetchAppointments();
    } catch (error) {
      console.error("Lỗi thanh toán lịch hẹn:", error);
    }
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return {
    appointments,
    isModalVisible,
    setIsModalVisible,
    reason,
    setOpenSnackbar,
    openSnackbar,
    message,
    setReason,
    handleChange,
    selectedAppointmentId,
    setSelectedAppointmentId,
    value,
    setValue,
    handlePageChange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    pagination,
    btnStatus,
    convertTrangThai,
    fetchAppointments,
    searchAppointments,
    cancelAppointment,
    confirmAppointment,
    completeAppointment,
    payAppointment,
  };
};

export default AppointmentController;
