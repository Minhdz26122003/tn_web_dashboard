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
  Slider,
  Button,
  Fab,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import { Snackbar, Alert } from "@mui/material";
import "./service.css"; // Import style riêng
import url from "../../Global/ipconfixad";
import ServiceController from "../../Controller/Service/ServiceController";
const Service = () => {
  const {
    services,
    pagination,
    openEdit,
    openAdd,
    searchTerm,
    selectedService,
    priceRange,
    openSnackbar,
    message,
    expandedRows,
    fetchServices,
    setOpenSnackbar,
    setMessage,
    handleSearch,
    setSelectedService,
    handleAddSubmit,
    handleAddClick,
    handleAddClose,
    handlePageChange,
    handleEditSubmit,
    handleEdit,
    handleEditClose,
    handleDelete,
    formatPrice,
    toggleExpand,
    setOpenEdit,
    setOpenAdd,
    setSearchTerm,
    setPriceRange,
    resetSelectedService,
  } = ServiceController(url);

  return (
    <div>
      {/* Thanh tìm kiếm */}
      <Box className="service-topbar">
        <Box className="service-search-container">
          <TextField
            className="service-search-bar"
            label="Tìm kiếm dịch vụ"
            variant="outlined"
            fullWidth
            size="medium"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm theo tên dich vụ"
          />
        </Box>
        <Box className="service-dropdown">
          <Typography sx={{ fontSize: 14 }} className="search-text">
            {" "}
            Giá tiền
          </Typography>
          <Slider
            size="small"
            className="service-search-price"
            value={priceRange}
            onChange={(e, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={10000000}
            step={100000}
            valueLabelFormat={(value) =>
              new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(value)
            }
          />
        </Box>
      </Box>
      <TableContainer component={Paper} className="service-table-container">
        <Table aria-label="service table" className="service-table">
          {/* Tiêu đề bảng*/}
          <TableHead className="head-service">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên Dịch vụ</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Giá tiền</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Thời gian thực hiện</TableCell>

              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {services && services.length > 0 ? (
              services.map((service) => (
                <TableRow key={service.service_id}>
                  <TableCell>{service.service_id}</TableCell>
                  <TableCell>{service.service_name}</TableCell>{" "}
                  <TableCell>
                    {expandedRows[service.service_id] ? (
                      <>
                        {service.description || "Không có mô tả"}{" "}
                        <Button
                          color="primary"
                          size="small"
                          onClick={() => toggleExpand(service.service_id)}
                        >
                          Thu gọn
                        </Button>
                      </>
                    ) : (
                      <>
                        {service.description && service.description.length > 100
                          ? `${service.description.slice(0, 100)}...`
                          : service.description || "Không có mô tả"}
                        {service.description &&
                          service.description.length > 100 && (
                            <Button
                              color="primary"
                              size="small"
                              onClick={() => toggleExpand(service.service_id)}
                            >
                              Xem thêm
                            </Button>
                          )}
                      </>
                    )}
                  </TableCell>
                  <TableCell>{formatPrice(service.price)}</TableCell>
                  <TableCell>
                    <img
                      src={service.service_img}
                      alt={service.service_name}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </TableCell>
                  <TableCell>{service.time}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(service)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(service.service_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có dịch vụ nào được tìm thấy
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

      {/* Dialog sửa*/}
      <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="md">
        <DialogTitle>Sửa dịch vụ</DialogTitle>
        <DialogContent>
          {selectedService && (
            <>
              <TextField
                label="Tên dịch vụ"
                fullWidth
                margin="normal"
                value={selectedService.service_name}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    service_name: e.target.value,
                  })
                }
              />
              <TextField
                label="Mô tả"
                fullWidth
                margin="normal"
                value={selectedService.description}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    description: e.target.value,
                  })
                }
              />
              <TextField
                label="Giá tiền"
                fullWidth
                margin="normal"
                value={formatPrice(selectedService.price)}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    price: e.target.value,
                  })
                }
              />
              <TextField
                label="Hình ảnh"
                fullWidth
                margin="normal"
                value={selectedService.service_img}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    service_img: e.target.value,
                  })
                }
              />
              <TextField
                label="Thời gian thực hiện"
                fullWidth
                margin="normal"
                value={selectedService?.time || ""}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    time: e.target.value,
                  })
                }
              />
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
      </Dialog>

      {/* Dialog thêm */}
      <Dialog open={openAdd} onClose={handleAddClose} fullWidth maxWidth="md">
        <DialogTitle>Thêm dịch vụ</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên dịch vụ"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedService({
                ...selectedService,
                service_name: e.target.value,
              })
            }
          />
          <TextField
            label="Mô tả"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedService({
                ...selectedService,
                description: e.target.value,
              })
            }
          />
          <TextField
            label="Giá tiền"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedService({
                ...selectedService,
                price: e.target.value,
              })
            }
          />
          {/* Thay đổi: Nhập URL hình ảnh */}
          <TextField
            label="URL Hình ảnh"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedService({
                ...selectedService,
                service_img: e.target.value,
              })
            }
          />
          <TextField
            label="Thời gian thực hiện (giờ)"
            type="text"
            fullWidth
            margin="normal"
            value={selectedService.time || "00:00:00"}
            onChange={(e) =>
              setSelectedService({
                ...selectedService,
                time: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddClose}
            style={{ backgroundColor: "#ff0000", color: "#fff" }}
          >
            Trở lại
          </Button>
          <Button
            onClick={() => handleAddSubmit(selectedService)}
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

export default Service;
