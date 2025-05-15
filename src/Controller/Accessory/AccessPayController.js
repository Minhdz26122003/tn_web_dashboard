import ApiService from "../../services/ApiCaller";
import url from "../../Global/ipconfixad";

const basePath = `${url}apihm/Admin/AccessPayment`;

export const fetchAccessPayments = async (appointmentId) => {
  try {
    const res = await ApiService.get(`${basePath}/get_access_pay.php`, {
      params: { appointment_id: appointmentId },
    });
    if (res.data.success) {
      return res.data.parts;
    }
    throw new Error(res.data.message || "Không lấy được dữ liệu");
  } catch (err) {
    console.error("fetchAccessPayments:", err);
    return [];
  }
};

export const deleteAccessPayment = async (appointmentId, accessoryId) => {
  try {
    const res = await ApiService.post(`${basePath}/delete_access_pay.php`, {
      appointment_id: appointmentId,
      accessory_id: accessoryId,
    });
    if (!res.data.success) {
      throw new Error(res.data.message || "Xóa thất bại");
    }
    return true;
  } catch (err) {
    console.error("deleteAccessPayment:", err);
    return false;
  }
};
