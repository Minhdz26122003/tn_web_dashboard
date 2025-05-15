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
  Fab,
  Box,
  Select,
  MenuItem,
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";
import "./Payment.css"; // Import style riêng
import url from "../../Global/ipconfixad";
import Pagination from "@mui/material/Pagination";
import PaymentController from "../../Controller/Payment/PaymentController";
import PaymentModel from "../../Model/Payment/PaymentModel";
const Payment = () => {
  const {
    payments,
    selectedPayment,
    searchTerm,
    endDate,
    startDate,
    pagination,
    setSelectedPayment,
    setStartDate,
    setSearchTerm,
    setEndDate,
    handlePageChange,
    setPagination,
    formatPrice,
    setPayment,
  } = PaymentController(url);
  return (
    <div>
      {/* Thanh tìm kiếm */}

      <Box className="book-search-bar">
        <TextField
          className="book-search-start"
          label="Ngày bắt đầu"
          variant="outlined"
          type="date"
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
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper} className="payment-table-container">
        <Table aria-label="payment table" className="payment-table">
          {/* Tiêu đề bảng */}
          <TableHead className="head-payment">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID Lịch hẹn</TableCell>
              <TableCell>Ngày thanh toán</TableCell>
              <TableCell>Hình thức</TableCell>
              <TableCell>Tổng tiền</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments && payments.length > 0 ? (
              payments.map((data) => {
                const payment = new PaymentModel({ ...data });
                return (
                  <TableRow key={payment.idthanhtoan}>
                    <TableCell>{payment.idthanhtoan}</TableCell>
                    <TableCell>{payment.idlichhen}</TableCell>
                    <TableCell>
                      {new Date(payment.ngaythanhtoan).toLocaleDateString(
                        "en-GB",
                        { year: "numeric", month: "2-digit", day: "2-digit" }
                      )}
                    </TableCell>

                    <TableCell>{payment.hinhthuc}</TableCell>
                    <TableCell>{formatPrice(payment.tongtien)}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có hóa đon nào được tìm thấy
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
    </div>
  );
};

export default Payment;
