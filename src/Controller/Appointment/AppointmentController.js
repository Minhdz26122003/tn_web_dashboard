import { useState, useEffect } from "react";
import axios from "axios";
import ApiService from "../../services/ApiCaller";
import AppointmentModel from "../../Model/Appointment/AppointmentModel";
import PayModal from "../../Pages/Appointment/PayModal";

const AppointmentController = (url) => {
  const [appointments, setAppointments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [value, setValue] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [totalAppointment, setTotalAppointment] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    unconfirmed: 0,
    quote_appoint: 0,
    accepted_quote: 0, // Đã chấp nhận báo giá
    under_repair: 0,
    completed: 0, // Hoàn thành
    settlement: 0,
    pay: 0,
    paid: 0,
    canceled: 0,
  });
  const [settlementOpen, setSettlementOpen] = useState(false);
  const fetchSettlement = (id) => {
    setCurrentAppointmentId(id);
    setSettlementOpen(true);
  };
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);

  const [newParts, setNewParts] = useState([]); // State cho phụ tùng mới thêm
  const [isAddPartsModalVisible, setIsAddPartsModalVisible] = useState(false);

  const filteredAppointments = appointments.filter((appointment) => {
    if (value === 0) {
      return true;
    }
    //status(chỉ mục tab - 1)
    const statusToFilter = Number(value) - 1;
    return appointment.status === statusToFilter;
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
      1: "Báo giá",
      2: "Đã chấp nhận báo giá",
      3: "Đang sửa",
      4: "Hoàn thành",
      5: "Quyết toán",
      6: "Thanh toán",
      7: "Đã thanh toán",
      8: "Đã hủy",
    };
    return trangThaiMap[trangThai] || "Không xác định";
  };

  // Xử lý trạng thái nút hành động
  const btnStatus = (trangThai) => {
    switch (trangThai) {
      case 0: // Chưa xác nhận
        return {
          confirm: false,
          cancel: false,
          action: null,
          viewSettlement: true,
        };
      case 1: // Chưa xác nhận
        return {
          confirm: true,
          cancel: true,
          action: "confirm",
          viewSettlement: true,
        };
      case 2: // Đang báo giá
        return { confirm: false, cancel: false, action: null };
      case 3: // Đã chấp nhận báo giá
        return { confirm: true, cancel: false, action: "startRepair" };
      case 4: // Đang sửa
        return {
          confirm: true,
          cancel: false,
          action: "completeRepair",
          addParts: true,
          viewSettlement: true, // that ra là dang ơ tab hoan thanh
        };
      case 5: // Hoàn thành
        return {
          confirm: true,
          cancel: false,
          action: "settlement",
          viewSettlement: true, // that ra là dang ơ tab quyết toán
        };
      case 6: // Quyết toán
        return {
          confirm: false,
          cancel: false,
          action: "paid",
        };
      case 7: // Thanh toán
        return { confirm: true, cancel: false, action: "paid" };
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
          reason: lyDo,
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
      const response = await ApiService.post(
        `${url}apihm/Admin/Appointment/confirm_appoint.php`,
        {
          appointment_id: id,
        }
      );
      if (response.data.success) {
        setMessage("Xác nhận lịch thành công!");
        setOpenSnackbar(true);
        fetchAppointments();
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Lỗi xác nhận lịch hẹn:", error);
    }
  };

  // Bắt đầu sửa chữa
  const startRepair = async (id) => {
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Appointment/start_repair.php`,
        {
          appointment_id: id,
        }
      );
      if (response.data.success) {
        fetchAppointments();
        setMessage("Đã bắt đầu sửa chữa !");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.error);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Lỗi bắt đầu sửa chữa:", error);
    }
  };

  // Hoàn thành lịch hẹn
  const completeAppointment = async (id) => {
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Appointment/complete_appoint.php`,
        {
          appointment_id: id,
        }
      );
      if (response.data.success) {
        setMessage("Đã hoàn thành sửa chữa lịch hẹn!");
        setOpenSnackbar(true);
        fetchAppointments();
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Lỗi hoàn thành lịch hẹn:", error);
    }
  };

  // Gửi quyết toán
  const sendSettlement = async (id) => {
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Appointment/send_settlement.php`,
        {
          appointment_id: id,
        }
      );
      if (response.data.success) {
        setMessage("Gửi quyết toán thành công!");
        setOpenSnackbar(true);
        fetchAppointments();
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Lỗi gửi quyết toán:", error);
    }
  };

  // Xác nhận thanh toán
  const confirmPayment = async (id) => {
    try {
      const res = await ApiService.post(
        `${url}apihm/Admin/Appointment/paymented_appoint.php`,
        { appointment_id: id }
      );
      if (res.data.success) {
        fetchAppointments();
        setMessage("Lịch hẹn đã được thanh toán!");
        setOpenSnackbar(true);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      console.error("Lỗi xác nhận thanh toán:", err);
      setMessage(err.message || "Xác nhận thanh toán thất bại!");
      setOpenSnackbar(true);
    }
  };

  // Thêm phụ tùng vào lịch hẹn
  const addPartsToAppointment = async (id, parts) => {
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/AccessPayment/add_access_pay.php`,
        {
          appointment_id: id,
          parts: parts.map((part) => ({
            id: part.id,
            quantity: part.quantity,
          })),
        }
      );

      if (response.data.success) {
        fetchAppointments();
        setMessage("Đã thêm phụ tùng thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Lỗi thêm phụ tùng:", error);
      setMessage("Lỗi kết nối hoặc lỗi server.");
      setOpenSnackbar(true);
    } finally {
      setIsAddPartsModalVisible(false);
    }
  };

  const handleConfirm = (action, id) => {
    if (!id) {
      console.error("Thiếu id");
      return;
    }

    let message = "";
    switch (action) {
      case "confirm":
        message = "Bạn có chắc chắn muốn xác nhận lịch hẹn này?";
        break;
      case "acceptQuote":
        message = "Bạn có chắc chắn muốn chấp nhận báo giá này?";
        break;
      case "startRepair":
        message = "Bạn có muốn bắt đầu sửa chữa không?";
        break;
      case "completeRepair":
        message = "Xác nhận hoàn tất sửa chữa?";
        break;
      case "settlement":
        message = "Bạn có muốn gửi quyết toán hóa đơn ?";
        break;
      case "paid":
        message = "Xác nhận khách hàng đã thanh toán?";
        break;
      case "cancel":
        message = "Bạn có chắc chắn muốn hủy lịch hẹn này?";
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
      case "startRepair":
        startRepair(id);
        break;
      case "completeRepair":
        completeAppointment(id);
        break;
      case "settlement":
        sendSettlement(id);
        break;
      case "send_invoice":
        sendInvoice(id);
        break;
      case "paid":
        confirmPayment(id);
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

  const openAddPartsModal = (appointment_id) => {
    setSelectedAppointmentId(appointment_id);
    setNewParts([]);
    setIsAddPartsModalVisible(true);
  };

  const closeAddPartsModal = () => {
    setIsAddPartsModalVisible(false);
  };

  return {
    appointments,
    isModalVisible,
    startDate,
    handleChange,
    setValue,
    value,
    reason,
    openSnackbar,
    selectedAppointmentId,
    message,
    pagination,
    endDate,
    filteredAppointments,
    statusCounts,
    totalAppointment,

    settlementOpen,
    setSettlementOpen,
    fetchSettlement,
    currentAppointmentId,

    setStatusCounts,
    handleConfirm,
    openCancelModal,
    closeCancelModal,
    setIsModalVisible,
    setOpenSnackbar,
    setReason,
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
    //payAppointment,
    addPartsToAppointment,
    openAddPartsModal,
    closeAddPartsModal,
    isAddPartsModalVisible,
    setSelectedAppointmentId,
  };
};

export default AppointmentController;
