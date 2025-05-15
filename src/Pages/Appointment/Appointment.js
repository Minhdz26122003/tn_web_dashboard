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
} from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import "./Appointment.css";
import AppointmentController from "../../Controller/Appointment/AppointmentController";
import AppointmentModel from "../../Model/Appointment/AppointmentModel";
import url from "../../Global/ipconfixad";
import AddPartsModal from "./AddPartModal";
import ViewAccessPayModal from "../Accessory/viewAccessPay";
import PayModal from "../../Pages/Appointment/PayModal";

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
    fetchSettlement,
    settlementOpen,
    setSettlementOpen,
    currentAppointmentId,
    handleChange,
    setStatusCounts,
    handleConfirm,
    openCancelModal,
    closeCancelModal,
    setIsModalVisible,
    setOpenSnackbar,
    setReason,
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
    //payAppointment,
    addPartsToAppointment,
    openAddPartsModal,
    closeAddPartsModal,
    isAddPartsModalVisible,
    setSelectedAppointmentId,
  } = AppointmentController(url);
  const { confirm, cancel, action } = btnStatus(value);

  const [isViewPartsInvoiceModalOpen, setIsViewPartsInvoiceModalOpen] =
    useState(false);
  const [
    selectedAppointmentForPartsInvoice,
    setSelectedAppointmentForPartsInvoice,
  ] = useState(null);

  // Hàm để mở modal
  const handleOpenViewPartsInvoiceModal = (appointmentId) => {
    setSelectedAppointmentForPartsInvoice(appointmentId);
    setIsViewPartsInvoiceModalOpen(true);
  };

  // Hàm để đóng modal
  const handleCloseViewPartsInvoiceModal = () => {
    setIsViewPartsInvoiceModalOpen(false);
    setSelectedAppointmentForPartsInvoice(null);
  };
  return (
    <div>
      <Box className="book-topbar">
        {/* Tab chọn trạng thái */}
        <Box className="book-tab-container">
          <Tabs
            className="tabstatus"
            value={value}
            variant="scrollable"
            scrollButtons="auto"
            onChange={handleChange}
            aria-label="Appointment Status Tabs"
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
            <Tab
              className="tabitem"
              size=""
              label={
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Tất cả&nbsp;
                  <Box
                    component="span"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    ({statusCounts.all})
                  </Box>
                </Box>
              }
              sx={{
                padding: "10px 7px",
                minHeight: "auto",
                minWidth: "auto",
              }}
            />
            <Tab
              className="tabitem"
              label={
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Chưa xác nhận&nbsp;
                  <Box
                    component="span"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    ({statusCounts.unconfirmed})
                  </Box>
                </Box>
              }
              sx={{
                padding: "12px 10px",
                minHeight: "auto",
                minWidth: "auto",
              }}
            />
            <Tab
              className="tabitem"
              //label={`Báo giá (${statusCounts.quote_appoint})`}
              label={
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "start" }}
                >
                  Đang báo giá &nbsp;
                  <Box
                    component="span"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    ({statusCounts.quote_appoint})
                  </Box>
                </Box>
              }
              sx={{
                padding: "12px 10px",
                minHeight: "auto",
                minWidth: "auto",
              }}
            />
            <Tab
              className="tabitem"
              label={
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "start" }}
                >
                  Đã chấp nhận giá &nbsp;
                  <Box
                    component="span"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    ({statusCounts.accepted_quote})
                  </Box>
                </Box>
              }
              sx={{
                padding: "12px 10px",
                minHeight: "auto",
                minWidth: "auto",
              }}
            />
            <Tab
              className="tabitem"
              label={
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "start" }}
                >
                  Đang sửa &nbsp;
                  <Box
                    component="span"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    ({statusCounts.under_repair})
                  </Box>
                </Box>
              }
              sx={{
                padding: "12px 10px",
                minHeight: "auto",
                minWidth: "auto",
              }}
            />
            <Tab
              className="tabitem"
              label={
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "start" }}
                >
                  Hoàn thành &nbsp;
                  <Box
                    component="span"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    ({statusCounts.completed})
                  </Box>
                </Box>
              }
              sx={{
                padding: "12px 10px",
                minHeight: "auto",
                minWidth: "auto",
              }}
            />
            <Tab
              className="tabitem"
              label={
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "start" }}
                >
                  Quyết toán &nbsp;
                  <Box
                    component="span"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    ({statusCounts.settlement})
                  </Box>
                </Box>
              }
              sx={{
                padding: "12px 10px",
                minHeight: "auto",
                minWidth: "auto",
              }}
            />
            <Tab
              className="tabitem"
              label={
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "start" }}
                >
                  Thanh toán &nbsp;
                  <Box
                    component="span"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    ({statusCounts.pay})
                  </Box>
                </Box>
              }
              sx={{
                padding: "12px 10px",
                minHeight: "auto",
                minWidth: "auto",
              }}
            />
            <Tab
              className="tabitem"
              label={
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "start" }}
                >
                  Đã thanh toán &nbsp;
                  <Box
                    component="span"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    ({statusCounts.paid})
                  </Box>
                </Box>
              }
              sx={{
                padding: "12px 10px",
                minHeight: "auto",
                minWidth: "auto",
              }}
            />
            <Tab
              className="tabitem"
              label={
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "start" }}
                >
                  Đã hủy &nbsp;
                  <Box
                    component="span"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    ({statusCounts.canceled})
                  </Box>
                </Box>
              }
              sx={{
                padding: "12px 10px",
                minHeight: "auto",
                minWidth: "auto",
              }}
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
          size="small"
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
          size="small"
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
          <span style={{ color: "red" }}>{totalAppointment}</span>
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
              <TableCell>Tên gara</TableCell>
              <TableCell>Tên dịch vụ</TableCell>
              <TableCell>Ngày hẹn</TableCell>
              <TableCell>Thời gian hẹn</TableCell>
              <TableCell>Trạng thái</TableCell>
              {value === 9 && <TableCell>Lý do hủy</TableCell>}
              {value != 8 && <TableCell>Hành động</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody className="body-book">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((data) => {
                const appointment = new AppointmentModel({ ...data });
                {
                  /* console.log(
                  "Appointment ID:",
                  appointment.appointment_id,
                  "Status:",
                  appointment.status,
                  "ViewSettlement Flag:",
                  btnStatus(appointment.status).viewSettlement
                ); */
                }
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

                    {value === 8 && (
                      <TableCell>
                        {appointment.reason || "Chưa có lý do"}
                      </TableCell>
                    )}

                    <TableCell className="book-table-actions">
                      {/* xác nhận */}
                      {confirm && (
                        <IconButton
                          color="success"
                          onClick={() =>
                            handleConfirm(action, appointment.appointment_id)
                          }
                          disabled={!btnStatus(value).confirm}
                        >
                          <CheckIcon />
                        </IconButton>
                      )}

                      {/* xóa */}
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

                      {/* Xem quyết toán*/}
                      {btnStatus(appointment.status).viewSettlement && (
                        <IconButton
                          color="info"
                          onClick={() =>
                            fetchSettlement(appointment.appointment_id)
                          }
                          title="Xem quyết toán"
                        >
                          <RemoveRedEyeIcon />
                        </IconButton>
                      )}

                      {/* thêm phu tung */}
                      {btnStatus(Number(value)).addParts && (
                        <IconButton
                          color="primary"
                          onClick={() =>
                            openAddPartsModal(appointment.appointment_id)
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      )}

                      {/* Xem hoá đơn phụ tùng ở sửa chữa*/}
                      {appointment.status === 3 && (
                        <IconButton
                          color="info"
                          onClick={() =>
                            handleOpenViewPartsInvoiceModal(
                              appointment.appointment_id
                            )
                          }
                          title="Xem hóa đơn phụ tùng"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      )}

                      {/* Modal Thêm Phụ Tùng */}
                      <AddPartsModal
                        isOpen={isAddPartsModalVisible}
                        onClose={closeAddPartsModal}
                        selectedAppointmentId={selectedAppointmentId}
                        addPartsToAppointment={addPartsToAppointment}
                      />

                      {/* Modal Hóa Đơn Phụ Tùng */}
                      <ViewAccessPayModal
                        open={isViewPartsInvoiceModalOpen}
                        onClose={handleCloseViewPartsInvoiceModal}
                        appointmentId={selectedAppointmentForPartsInvoice}
                      />

                      {/* Modal Hóa Đơn Tổng */}
                      <PayModal
                        open={settlementOpen}
                        onClose={() => setSettlementOpen(false)}
                        appointmentId={currentAppointmentId}
                      />
                      {/* Modal nhập lý do hủy */}
                      <Dialog
                        open={isModalVisible}
                        onClose={closeCancelModal}
                        fullWidth
                      >
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
