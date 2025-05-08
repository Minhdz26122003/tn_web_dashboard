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
  Typography,
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
import AppointmentModel from "../../Model/Appointment/AppointmentModel";
import url from "../../Global/ipconfixad";

const Appointment = () => {
  const {
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
                backgroundColor: "#0066ff",
              },
            }}
          >
            <Tab
              className="tabitem"
              label={`Chưa xác nhận (${statusCounts.unconfirmed})`}
            />
            <Tab
              className="tabitem"
              label={`Báo giá (${statusCounts.quote_appoint})`}
            />
            <Tab
              className="tabitem"
              label={`Đang sửa (${statusCounts.under_repair})`}
            />
            <Tab
              className="tabitem"
              label={`Quyết toán (${statusCounts.settlement})`}
            />
            <Tab
              className="tabitem"
              label={`Thanh toán (${statusCounts.pay})`}
            />
            <Tab
              className="tabitem"
              label={`Đã thanh toán (${statusCounts.paid})`}
            />
            <Tab
              className="tabitem"
              label={`Đã hủy (${statusCounts.canceled})`}
            />
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
      {/* Hiển thị tổng số lịch hẹn */}
      <Box sx={{ margin: "10px 0" }}>
        <Typography component="div" sx={{ fontSize: "15px" }}>
          Tổng số lịch hẹn:{" "}
          <span style={{ color: "blue" }}>{totalAppointment}</span>
        </Typography>
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
              <TableCell>Tên dịch vụ</TableCell>
              <TableCell>Ngày hẹn</TableCell>
              <TableCell>Thời gian hẹn</TableCell>
              <TableCell>Trạng thái</TableCell>

              {value === 4 && <TableCell>Lý do hủy</TableCell>}
              {value != 4 && value != 3 && <TableCell>Hành động</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((data) => {
                const appointment = new AppointmentModel({ ...data });
                return (
                  <TableRow key={appointment.appointment_id}>
                    <TableCell>{appointment.appointment_id}</TableCell>
                    <TableCell>{appointment.username}</TableCell>
                    <TableCell>{appointment.license_plate}</TableCell>
                    <TableCell>{appointment.gara_name}</TableCell>
                    <TableCell>{appointment.service_name}</TableCell>
                    <TableCell>
                      {new Date(
                        appointment.appointment_date
                      ).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </TableCell>

                    <TableCell>{appointment.appointment_time}</TableCell>
                    <TableCell>
                      {convertTrangThai(appointment.status)}
                    </TableCell>

                    {value === 4 && (
                      <TableCell>
                        {appointment.reason || "Chưa có lý do"}
                      </TableCell>
                    )}
                    <TableCell className="book-table-actions">
                      {confirm && (
                        <IconButton
                          color="success"
                          onClick={() =>
                            handleConfirm(
                              btnStatus(appointment.reason).action,
                              appointment.appointment_id
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
                          onClick={() =>
                            openCancelModal(appointment.appointment_id)
                          }
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
                            onClick={() =>
                              Huylich(selectedAppointmentId, reason)
                            }
                            color="primary"
                          >
                            Hủy lịch
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })
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
