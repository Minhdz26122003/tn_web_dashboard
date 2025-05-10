import { useState, useEffect } from "react";
import axios from "axios";
import ApiService from "../../services/ApiCaller";
import AppointmentModel from "../../Model/Appointment/AppointmentModel";

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
  const [totalAppointment, setTotalAppointment] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const [statusCounts, setStatusCounts] = useState({
    unconfirmed: 0,
    quote_appoint: 0,
    under_repair: 0,
    settlement: 0,
    pay: 0,
    paid: 0,
    canceled: 0,
  });

  const filteredAppointments = appointments.filter((appointment) => {
    const matchStatus =
      value !== "" ? appointment.status === Number(value) : true;
    return matchStatus;
  });

  // Hàm lấy danh sách lịch hẹn
  const fetchAppointments = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Appointment/get_appoint.php`,
        {
          params: { page, limit },
        }
      );
      const data = response.data;
      if (data && Array.isArray(data.data)) {
        const { statusCounts, totalAppointment } = data;
        setStatusCounts(statusCounts);
        const appoint_data = data.data.map(
          (app) => new AppointmentModel({ ...app })
        );
        setTotalAppointment(totalAppointment);
        setAppointments(appoint_data);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          limit,
        });
      } else {
        setAppointments([]);
        setTotalAppointment(0);
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch hẹn:", error);
      setTotalAppointment(0);
    }
  };

  // Hàm tìm kiếm lịch hẹn theo ngày
  const searchAppointments = async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        console.error("Ngày bắt đầu và kết thúc không hợp lệ.");
        return;
      }
      const response = await ApiService.get(
        `${url}apihm/Admin/Appointment/search_appoint.php?start_date=${startDate}&end_date=${endDate}`
      );
      if (response.data.success) {
        const appoint_data = (response.data.appointments || []).map(
          (app) => new AppointmentModel({ ...app })
        );
        setAppointments(appoint_data);
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
      0: "Chưa xác nhận",
      1: "Đang báo giá",
      2: "Đang sửa",
      3: "Quyết toán",
      4: "Thanh toán",
      5: "Đã thanh toán",
      6: "Đã hủy",
    };
    return trangThaiMap[trangThai] || "Không xác định";
  };

  // Xử lý trạng thái nút hành động
  const btnStatus = (trangThai) => {
    switch (trangThai) {
      case 0:
        return { confirm: true, cancel: true, action: "confirm" };
      case 1:
        return { confirm: true, cancel: false, action: null };
      case 2:
        return { confirm: true, cancel: false, action: "payment" };
      case 3:
        return { confirm: true, cancel: false, action: "confirm" };
      case 4:
        return { confirm: false, cancel: false, action: null };
      case 5:
        return { confirm: true, cancel: false, action: "confirm" };
      case 6:
        return { confirm: true, cancel: false, action: "confirm" };
      default:
        return { confirm: false, cancel: false, action: null };
    }
  };

  // Hủy lịch hẹn
  const cancelAppointment = async (appointment_id, lyDo) => {
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Appointment/cancel_appoint.php`,
        {
          appointment_id,
          lydohuy: lyDo,
        }
      );

      if (response.data.success) {
        setMessage("Lịch hẹn đã được hủy!");
        setOpenSnackbar(true);

        fetchAppointments();
        closeCancelModal();
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error(error);
      console.log("Lỗi", "Không thể kết nối với máy chủ.");
    }
  };

  // Xác nhận lịch hẹn
  const confirmAppointment = async (id) => {
    try {
      await ApiService.post(
        `${url}apihm/Admin/Appointment/confirm_appoint.php`,
        {
          appointment_id: id,
        }
      );
      fetchAppointments();
    } catch (error) {
      console.error("Lỗi xác nhận lịch hẹn:", error);
    }
  };

  // Gửi a
  // Hoàn thành lịch hẹn
  const completeAppointment = async (id) => {
    try {
      await ApiService.post(
        `${url}apihm/Admin/Appointment/complete_appoint.php`,
        {
          appointment_id: id,
        }
      );
      fetchAppointments();
    } catch (error) {
      console.error("Lỗi hoàn thành lịch hẹn:", error);
    }
  };

  // Thanh toán lịch hẹn
  const payAppointment = async (id) => {
    try {
      await axios.ApiService(
        `${url}apihm/Admin/Appointment/paymented_appoint.php`,
        {
          appointment_id: id,
        }
      );
      fetchAppointments();
    } catch (error) {
      console.error("Lỗi thanh toán lịch hẹn:", error);
    }
  };

  const handleConfirm = (action, id) => {
    if (!id) {
      console.error("Thiếu id");
      return;
    }

    let message;
    switch (action) {
      case "confirm":
        message = "Bạn có chắc chắn muốn xác nhận lịch hẹn này?";
        break;
      case "complete":
        message = "Bạn có chắc chắn muốn hoàn thành lịch hẹn này?";
        break;
      case "payment":
        message = "Bạn có chắc chắn muốn thanh toán lịch hẹn này?";
        break;
      default:
        message = "Bạn có chắc chắn muốn thực hiện hành động này?";
    }

    const confirmAction = window.confirm(message);
    if (!confirmAction) {
      console.log("Hủy hành động");
      return;
    }

    switch (action) {
      case "confirm":
        confirmAppointment(id);
        break;
      case "complete":
        completeAppointment(id);
        break;
      case "payment":
        payAppointment(id);
        break;
      default:
        console.warn("Hành động không hợp lệ:", action);
        break;
    }
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const closeCancelModal = () => {
    setIsModalVisible(false);
  };

  const openCancelModal = (appointment_id) => {
    setSelectedAppointmentId(appointment_id);
    setReason("");
    setIsModalVisible(true);
  };
  return {
    appointments,
    isModalVisible,
    startDate,
    reason,
    openSnackbar,
    value,
    selectedAppointmentId,
    message,
    pagination,
    endDate,
    filteredAppointments,
    statusCounts,
    totalAppointment,
    setStatusCounts,
    handleConfirm,
    openCancelModal,
    closeCancelModal,
    setIsModalVisible,
    setOpenSnackbar,
    setReason,
    handleChange,
    setSelectedAppointmentId,
    setValue,
    handlePageChange,
    setStartDate,
    setEndDate,
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
