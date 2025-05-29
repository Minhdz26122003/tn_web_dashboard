import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  DialogActions,
  Button,
  TableContainer,
  Paper,
} from "@mui/material";
import ApiService from "../../services/ApiCaller";
import url from "../../Global/ipconfixad";
import "./PayModal.css";
import Divider from "@mui/material/Divider";

export default function PayModal({ open, onClose, appointmentId }) {
  const [data, setData] = useState({
    services: [],
    parts: [],
    service_total: 0,
    parts_total: 0,
    total: 0,
    deposit_amount: 0, // Thêm trường này
    total_after: 0, // Thêm trường này
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchPayment = async () => {
      setLoading(true);
      try {
        const res = await ApiService.get(
          `${url}apihm/Admin/Payment/get_payment_total.php`,
          {
            params: { appointment_id: appointmentId },
          }
        );
        if (res.data.success) {
          setData(res.data);
        } else {
          throw new Error(res.data.message || "Không lấy được dữ liệu");
        }
      } catch (err) {
        console.error("fetchPayments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [open, appointmentId]);

  const fmt = (n) => n.toLocaleString("vi-VN") + "₫";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Chi tiết & Quyết toán</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : (
          <>
            {/* Bảng dịch vụ */}
            <Typography fontWeight="bold">Hoá đơn dịch vụ</Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table className="service-table" size="small">
                <TableHead className="head-service">
                  <TableRow>
                    <TableCell>Mã</TableCell>
                    <TableCell>Tên dịch vụ</TableCell>
                    <TableCell>Đơn giá</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="body-service">
                  {data.services.map((s) => (
                    <TableRow key={s.service_id}>
                      <TableCell>{s.service_id}</TableCell>
                      <TableCell>{s.service_name}</TableCell>
                      <TableCell>{fmt(s.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Bảng phụ tùng */}
            <Typography fontWeight="bold">Hoá đơn phụ tùng</Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table className="accesspay-table" size="small">
                <TableHead className="head-accesspay">
                  <TableRow>
                    <TableCell>Mã</TableCell>
                    <TableCell>Tên phụ tùng</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Đơn giá</TableCell>
                    <TableCell>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="body-accesspay">
                  {data.parts.map((p) => (
                    <TableRow key={p.accessory_id}>
                      <TableCell>{p.accessory_id}</TableCell>
                      <TableCell>{p.accessory_name}</TableCell>
                      <TableCell>{p.quantity}</TableCell>
                      <TableCell>{fmt(p.unit_price)}</TableCell>
                      <TableCell>{fmt(p.sub_total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Tổng cộng */}
            <Box textAlign="right" mt={2}>
              <Typography fontWeight="bold" sx={{ pb: 1 }}>
                Dịch vụ: {fmt(data.service_total)}
              </Typography>
              <Typography fontWeight="bold" sx={{ pb: 2 }}>
                Phụ tùng: {fmt(data.parts_total)}
              </Typography>
              <Typography fontWeight="bold" sx={{ pb: 2 }}>
                Tiền cọc: {fmt(data.deposit_amount)}
              </Typography>
              <Divider sx={{ borderBottomWidth: 2, borderColor: "#ff0000" }} />

              {/* Hiển thị số tiền đặt cọc */}
              {data.deposit_amount > 0 && ( // Chỉ hiển thị nếu có tiền cọc
                <Typography fontWeight="bold" sx={{ pt: 2, pb: 1 }}>
                  Tiền cọc: {fmt(data.deposit_amount)}
                </Typography>
              )}

              {/* Hiển thị tổng tiền sau khi trừ cọc */}
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ pt: 2 }}
                color="error"
              >
                Tổng cộng (sau cọc): {fmt(data.total_after)}{" "}
                {/* Sử dụng total_after */}
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          style={{ backgroundColor: "#1c77ff", color: "#fff" }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
