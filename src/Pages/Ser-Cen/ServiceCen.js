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
  MenuItem,
  Select,
  InputLabel,
  Button,
  Fab,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import { Snackbar, Alert } from "@mui/material";
import "./ServiceCen.css";
import TempController from "../../Controller/Ser-Cen/TempController";
import url from "../../Global/ipconfixad";

const ServiceCen = () => {
  const {
    services,
    centers,
    pagination,
    openEdit,
    openAdd,
    selectedService,
    searchTerm,
    selectedServiceCen,
    serviceCen,
    openSnackbar,
    message,
    handlePageChange,

    setOpenSnackbar,
    setMessage,
    setSelectedServiceCen,
    setSelectedService,
    handleAddSubmit,
    handleAddClick,
    handleAddClose,

    handleEdit,
    handleEditClose,
    handleDelete,
    setOpenEdit,
    setOpenAdd,
    setSearchTerm,
    resetSelectedSerCen,
  } = TempController(url);

  return (
    <div>
      <TableContainer component={Paper} className="serviceCen-table-container">
        <Table aria-label="serviceCen table" className="serviceCen-table">
          {/* Tiêu đề bảng*/}
          <TableHead className="head-serviceCen">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Trung tâm</TableCell>
              <TableCell>Dịch vụ</TableCell>

              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(serviceCen) && serviceCen.length > 0 ? (
              serviceCen.map((sercen) => (
                <TableRow key={sercen.id}>
                  <TableCell>{sercen.id}</TableCell>
                  <TableCell>{sercen.gara_name}</TableCell>
                  <TableCell>{sercen.service_name}</TableCell>

                  <TableCell className="serviceCen-table-actions">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(sercen.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có mã nào đươc tìm thấy
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

      {/* Dialog sửa */}
      {/* <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="md">
        <DialogTitle>Sửa dịch vụ</DialogTitle>
        <DialogContent>
          {selectedServiceCen && (
            <>
              <InputLabel>Trung tâm</InputLabel>
              <Select
                sx={{ mb: "5px" }}
                labelId="select-center-label"
                label="Trung tâm"
                fullWidth
                margin="normal"
                value={selectedServiceCen?.gara_id}
                onChange={(e) => {
                  setSelectedServiceCen({
                    ...selectedServiceCen,
                    gara_id: e.target.value,
                  });
                }}
              >
                {centers.map((center) => (
                  <MenuItem key={center.gara_id} value={center.gara_id}>
                    {center.gara_name}
                  </MenuItem>
                ))}
              </Select>

              <InputLabel id="select-service-label">Dịch vụ</InputLabel>
              <Select
                labelId="select-service-label"
                label="Dịch vụ"
                fullWidth
                margin="normal"
                value={selectedServiceCen?.service_id}
                onChange={(e) =>
                  setSelectedServiceCen({
                    ...selectedServiceCen,
                    service_id: e.target.value,
                  })
                }
              >
                {services.map((service) => (
                  <MenuItem key={service.service_id} value={service.service_id}>
                    {service.service_name}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditClose}
            style={{ backgroundColor: "#ff0000", color: "#fff" }}
          >
            Trở lại
          </Button>
          <Button
            onClick={handleEditSubmit}
            style={{ backgroundColor: "#228b22", color: "#fff" }}
          >
            Lưu lại
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Dialog thêm */}
      <Dialog open={openAdd} onClose={handleAddClose} fullWidth maxWidth="md">
        <DialogTitle>Thêm dịch vụ</DialogTitle>
        <DialogContent>
          {selectedServiceCen && (
            <>
              <InputLabel>Trung tâm</InputLabel>
              <Select
                sx={{ mb: "5px" }}
                labelId="select-center-label"
                label="Trung tâm"
                fullWidth
                margin="normal"
                value={selectedServiceCen?.gara_id || ""}
                onChange={(e) => {
                  const newCenterId = e.target.value;
                  setSelectedServiceCen({
                    ...selectedServiceCen,
                    gara_id: newCenterId,
                  });
                }}
              >
                {centers.map((center) => (
                  <MenuItem key={center.gara_id} value={center.gara_id}>
                    {center.gara_name}
                  </MenuItem>
                ))}
              </Select>

              <InputLabel id="select-service-label">Dịch vụ</InputLabel>
              <Select
                labelId="select-service-label"
                label="Dịch vụ"
                fullWidth
                margin="normal"
                value={selectedServiceCen?.service_id || ""}
                onChange={(e) =>
                  setSelectedServiceCen({
                    ...selectedServiceCen,
                    service_id: e.target.value,
                  })
                }
              >
                {services.map((service) => (
                  <MenuItem key={service.service_id} value={service.service_id}>
                    {service.service_name}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleAddClose}
            style={{ backgroundColor: "#ff0000", color: "#fff" }}
          >
            Trở lại
          </Button>
          <Button
            onClick={() => handleAddSubmit(selectedServiceCen)}
            style={{ backgroundColor: "#228b22", color: "#fff" }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút thêm dịch vụ */}
      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default ServiceCen;
