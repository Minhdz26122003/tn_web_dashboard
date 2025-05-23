import React from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Typography,
  Alert,
  Button,
} from "@mui/material";

import "./Payment.css";
import url from "../../Global/ipconfixad";
import Pagination from "@mui/material/Pagination";
import PaymentController from "../../Controller/Payment/PaymentController";
import PaymentModel from "../../Model/Payment/PaymentModel";
import PayModal from "../../Pages/Appointment/PayModal";
const Payment = () => {
  const {
    invoices,
    startDate,
    endDate,
    openSnackbar,
    pagination,
    settlementOpen,
    currentAppointmentId,
    openSettlement,
    closeSettlement,
    value,
    formCounts,
    totalInvoice,
    message,
    fetchInvoices,
    setMessage,
    setOpenSnackbar,
    setStartDate,
    setEndDate,
    handlePageChange,
    handleTabChange,
    formatPrice,
  } = PaymentController(url);

  const filtered = invoices.filter((inv) => {
    switch (value) {
      case 1:
        return inv.status === 0; // chưa thanh toán
      case 2:
        return inv.status === 1; // đã thanh toán
      case 3:
        return inv.status === 1 && inv.form === 1; // offline
      case 4:
        return inv.status === 1 && inv.form === 2; // online
      default:
        return true; // value = 0 => tất cả
    }
  });

  return (
    <div>
      <Box className="pay-topbar">
        <Box className="pay-tab-container">
          <Tabs
            className="tabstatus"
            value={value}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              width: "fit-content",
              fontWeight: "bold",
              fontSize: 10,
              minHeight: "auto",

              overflow: "visible",
              "& .MuiTabs-scroller": {
                backgroundColor: "#ffffff",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#0066ff",
              },
            }}
          >
            <Tab className="tabitem" label={`Tất cả (${formCounts.all})`} />
            <Tab
              className="tabitem"
              label={`Chưa thanh toán (${formCounts.unpaid})`}
            />
            <Tab
              className="tabitem"
              label={`Đã thanh toán (${formCounts.paid})`}
            />

            <Tab
              className="tabitem"
              label={`Thanh toán Online(VnPay) (${formCounts.online})`}
            />
            <Tab
              className="tabitem"
              label={`Trực tiếp(Tiền mặt) (${formCounts.offline})`}
            />
          </Tabs>
        </Box>
      </Box>
      <Box className="pay-search-container">
        <TextField
          className="pay-search-start"
          label="Ngày bắt đầu"
          size="small"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          className="pay-search-end"
          label="Ngày kết thúc"
          size="small"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Box>
      <Typography sx={{ margin: "10px 0" }}>
        Tổng số hóa đơn: <span style={{ color: "red" }}>{totalInvoice}</span>
      </Typography>
      <TableContainer component={Paper} className="pay-table-container">
        <Table aria-label="appointment table" className="pay-table">
          <TableHead className="head-pay">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID Lịch hẹn</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Hình thức</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="body-pay">
            {filtered.length ? (
              filtered.map((data) => {
                const pay = new PaymentModel({ ...data });
                {
                  /* {new Date(pay.payment_date).toLocaleDateString("vi-VN")} */
                }
                return (
                  <TableRow key={pay.payment_id}>
                    <TableCell>{pay.payment_id}</TableCell>
                    <TableCell>{pay.appointment_id}</TableCell>
                    <TableCell>{pay.payment_date_only}</TableCell>
                    <TableCell>{pay.payment_time_only}</TableCell>
                    <TableCell>{pay.form_label}</TableCell>
                    <TableCell>{pay.status_label}</TableCell>
                    <TableCell>{formatPrice(pay.total_price)} VND</TableCell>
                    <TableCell className="pay-table-actions">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => openSettlement(pay.appointment_id)}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có hóa đơn
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        display="flex"
        justifyContent="end"
        alignItems="center"
        marginTop={2}
      >
        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      {/* Modal hiển thị chi tiết */}
      <PayModal
        open={settlementOpen}
        onClose={closeSettlement}
        appointmentId={currentAppointmentId}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Payment;
