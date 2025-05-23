// PaymentModel.js
export default class PaymentModel {
  constructor(data) {
    this.payment_id = data.payment_id;
    this.appointment_id = data.appointment_id;
    this.payment_date = data.payment_date;
    this.form = data.form; // 0,1,2
    this.status = data.status; // 0,1
    this.total_price = data.total_price;

    // ánh xạ sang chuỗi dễ đọc
    const formMap = {
      0: "Không xác định",
      1: "Online (VnPay)",
      2: "Trưc tiếp (Tiền mặt)",
    };
    const statusMap = {
      0: "Chưa thanh toán",
      1: "Đã thanh toán",
    };
    this.form_label = formMap[this.form] || formMap[0];
    this.status_label = statusMap[this.status] || statusMap[0];

    // Tách ngày và giờ từ payment_date
    if (this.payment_date) {
      const dateObj = new Date(this.payment_date);
      this.payment_date_only = dateObj.toLocaleDateString("vi-VN");
      this.payment_time_only = dateObj.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }); // Định dạng giờ (ví dụ: 22:36)
    } else {
      this.payment_date_only = "";
      this.payment_time_only = "";
    }
  }
}
