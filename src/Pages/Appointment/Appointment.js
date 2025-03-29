import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Tabs,
  Select,
  Tab,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
  BorderAll,
} from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import "./Appointment.css";
import AppointmentController from "../../Controller/Appointment/AppointmentController";
import url from "../../Global/ipconfixad";

const Appointment = () => {
  const {
    appointments,
    isModalVisible,
    reason,
    pagination,
    selectedAppointmentId,
    value,
    startDate,
    endDate,
    setValue,
    message,
    setOpenSnackbar,
    openSnackbar,
    handleChange,
    setReason,
    setIsModalVisible,
    setEndDate,
    setStartDate,
    handlePageChange,
    btnStatus,
    setSelectedAppointmentId,
    convertTrangThai,
    fetchAppointments,
    searchAppointments,
    cancelAppointment,
    confirmAppointment,
    completeAppointment,
    payAppointment,
  } = AppointmentController(url);
  const { confirm, cancel } = btnStatus(value);
  return (
    <div>
      <Box className="book-topbar">
        {/* Tab chọn trạng thái */}
        <Box className="book-tab-container">
          <Tabs
            className="tabstatus"
            value={value}
            onChange={handleChange}
            aria-label="Appointment Status Tabs"
            sx={{
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              width: "fit-content",
              fontWeight: "bold",
              overflow: "visible",
              "& .MuiTabs-scroller": {
                backgroundColor: "#ffffff",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#0066ff", // Màu của indicator
              },
            }}
          >
            <Tab className="tabitem" label="Chưa xác nhận" />
            <Tab className="tabitem" label="Đang thực hiện" />
            <Tab className="tabitem" label="Hoàn thành" />
            <Tab className="tabitem" label="Đã thanh toán" />
            <Tab className="tabitem" label="Đã hủy" />
          </Tabs>
        </Box>
      </Box>
      {/* Tìm kiếm theo ngày */}
      <Box className="book-search-container">
        <TextField
          className="book-search-start"
          label="Ngày bắt đầu"
          variant="outlined"
          type="date"
          size="medium"
          InputLabelProps={{
            shrink: true,
          }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          className="book-search-end"
          label="Ngày kết thúc"
          variant="outlined"
          size="medium"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Box>
      {/* Bảng lịch hẹn */}
      <TableContainer component={Paper} className="book-table-container">
        <Table aria-label="appointment table" className="book-table">
          <TableHead className="head-book">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên người dùng</TableCell>
              <TableCell>Biển số xe</TableCell>
              <TableCell>Tên trung tâm</TableCell>
              <TableCell>Tên dịch Vụ</TableCell>
              <TableCell>Ngày hẹn</TableCell>
              <TableCell>Thời gian hẹn</TableCell>
              <TableCell>Trạng thái</TableCell>

              {value === 4 && <TableCell>Lý do hủy</TableCell>}
              {value != 4 && value != 3 && <TableCell>Hành động</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <TableRow key={appointment.idlichhen}>
                  <TableCell>{appointment.idlichhen}</TableCell>
                  <TableCell>{appointment.username}</TableCell>
                  <TableCell>{appointment.idxe}</TableCell>
                  <TableCell>{appointment.tentrungtam}</TableCell>
                  <TableCell>{appointment.tendichvu}</TableCell>
                  <TableCell>
                    {new Date(appointment.ngayhen).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </TableCell>

                  <TableCell>{appointment.thoigianhen}</TableCell>
                  <TableCell>
                    {convertTrangThai(appointment.trangthai)}
                  </TableCell>

                  {value === 4 && (
                    <TableCell>
                      {appointment.lydohuy || "Chưa có lý do"}
                    </TableCell>
                  )}
                  <TableCell className="book-table-actions">
                    {confirm && (
                      <IconButton
                        color="success"
                        onClick={() =>
                          handleConfirm(
                            btnStatus(appointment.trangthai).action,
                            appointment.idlichhen
                          )
                        }
                        disabled={!btnStatus(value).confirm}
                      >
                        <CheckIcon />
                      </IconButton>
                    )}
                    {cancel && (
                      <IconButton
                        color="warning"
                        onClick={() => openCancelModal(appointment.idlichhen)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                    {/* Modal nhập lý do hủy */}
                    <Dialog open={isModalVisible} onClose={closeCancelModal}>
                      <DialogTitle>Nhập lý do hủy lịch</DialogTitle>
                      <DialogContent>
                        <TextField
                          label="Lý do"
                          multiline
                          rows={4}
                          fullWidth
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={closeCancelModal} color="secondary">
                          Đóng
                        </Button>
                        <Button
                          onClick={() => Huylich(selectedAppointmentId, reason)}
                          color="primary"
                        >
                          Hủy lịch
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có lịch hẹn nào được tìm thấy
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

export default Appointment;
