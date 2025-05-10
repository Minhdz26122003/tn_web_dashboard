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
import ServiceModel from "../../Model/Service/ServiceModel";
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
    selectedFile,
    imagePreviewUrl,
    types,
    setTypes,
    fetchTypeServices,
    handleFileChange,
    handlePriceChangeInField,
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
              {[
                "ID",
                "Tên dịch vụ",
                "Mô tả",
                "Giá tiền",
                "Hình ảnh",
                "Thời gian thực hiện",
                "Hành động",
              ].map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {services && services.length > 0 ? (
              services.map((data) => {
                const service = new ServiceModel({ ...data });
                return (
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
                          {service.description &&
                          service.description.length > 100
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
                        style={{ width: "80px", height: "auto" }}
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
                );
              })
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
              <InputLabel>Loại dịch vụ</InputLabel>
              <FormControl fullWidth margin="normal">
                {" "}
                {/* Sử dụng FormControl */}
                <InputLabel id="select-type-label">
                  Loại dịch vụ
                </InputLabel>{" "}
                {/* InputLabel cần id */}
                <Select
                  labelId="select-type-label"
                  id="select-type"
                  label="Loại dịch vụ"
                  value={selectedService?.type_id || ""}
                  onChange={(e) => {
                    const newTypeId = e.target.value;
                    setSelectedService({
                      ...selectedService,
                      type_id: newTypeId,
                    });
                  }}
                >
                  {/* Render MenuItem từ mảng types */}
                  {/* Kiểm tra types là mảng trước khi map */}
                  {Array.isArray(types) &&
                    types.map((type) => (
                      <MenuItem key={type.type_id} value={type.type_id}>
                        {" "}
                        {type.type_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <TextField
                label="Giá tiền"
                fullWidth
                margin="normal"
                value={formatPrice(selectedService.price)}
                onChange={handlePriceChangeInField}
              />

              {/* Phần chọn ảnh mới */}
              <Box sx={{ margin: "normal", marginTop: 2 }}>
                <Typography variant="subtitle1">Hình ảnh dịch vụ:</Typography>
                {/* Input file ẩn đi */}
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="edit-service-image-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                {/* Nút để kích hoạt input file */}
                <label htmlFor="edit-service-image-upload">
                  <Button variant="contained" component="span">
                    Chọn ảnh từ máy
                  </Button>
                </label>
                {/* Hiển thị tên file đã chọn (nếu có) */}
                {selectedFile && (
                  <Typography variant="body2" sx={{ ml: 2, display: "inline" }}>
                    Đã chọn: {selectedFile.name}
                  </Typography>
                )}

                {/* Hiển thị ảnh xem trước (ảnh cũ hoặc ảnh mới) */}
                {imagePreviewUrl && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={imagePreviewUrl}
                      alt="Ảnh dịch vụ xem trước"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                )}
                {/* Nếu không có ảnh nào */}
                {!imagePreviewUrl &&
                  !selectedFile &&
                  selectedService &&
                  !selectedService.service_img && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      Chưa có ảnh nào cho dịch vụ này và chưa chọn ảnh mới.
                    </Typography>
                  )}
              </Box>

              {/* Trường text "Hình ảnh" ban đầu - có thể giữ lại để hiển thị URL (chỉ đọc) hoặc bỏ đi */}
              {/* Giữ lại để hiển thị URL hiện tại/mới cho Admin tiện theo dõi */}
              <TextField
                label="URL Hình ảnh"
                fullWidth
                margin="normal"
                value={selectedService.service_img || ""}
                InputProps={{
                  readOnly: true,
                }}
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
                placeholder="VD: 01:30:00 (1 giờ 30 phút)"
                helperText="Nhập thời gian theo định dạng HH:MM:SS"
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
            // value={selectedService.description}
            onChange={(e) =>
              setSelectedService({
                ...selectedService,
                description: e.target.value,
              })
            }
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="add-type-label">Loại dịch vụ</InputLabel>
            <Select
              labelId="add-type-label"
              id="add-type-select"
              label="Loại dịch vụ"
              value={selectedService?.type_id || ""}
              onChange={(e) =>
                setSelectedService({
                  ...selectedService,
                  type_id: e.target.value,
                })
              }
            >
              {types.map((type) => (
                <MenuItem key={type.type_id} value={type.type_id}>
                  {type.type_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Giá tiền"
            fullWidth
            margin="normal"
            value={formatPrice(selectedService.price)}
            onChange={handlePriceChangeInField}
          />

          {/* Thêm phần chọn ảnh cho dialog thêm tương tự dialog sửa */}
          <Box sx={{ margin: "normal", marginTop: 2 }}>
            <Typography variant="subtitle1">Hình ảnh dịch vụ:</Typography>
            {/* Input file ẩn đi */}
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="add-service-image-upload" // ID duy nhất cho dialog thêm
              type="file"
              onChange={handleFileChange} // Dùng chung handler chọn file
            />
            {/* Nút để kích hoạt input file */}
            <label htmlFor="add-service-image-upload">
              <Button variant="contained" component="span">
                Chọn ảnh từ máy
              </Button>
            </label>
            {/* Hiển thị tên file đã chọn (nếu có) */}
            {selectedFile && (
              <Typography variant="body2" sx={{ ml: 2, display: "inline" }}>
                Đã chọn: {selectedFile.name}
              </Typography>
            )}

            {/* Hiển thị ảnh xem trước (chỉ ảnh mới được chọn) */}
            {/* Đối với dialog thêm, preview chỉ hiển thị ảnh MỚI chọn */}
            {imagePreviewUrl && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={imagePreviewUrl}
                  alt="Ảnh dịch vụ xem trước"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
            {/* Hiển thị khi chưa chọn file */}
            {!selectedFile && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Chưa có ảnh nào được chọn.
              </Typography>
            )}
          </Box>

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
            placeholder="VD: 01:30:00 (1 giờ 30 phút)"
            helperText="Nhập thời gian theo định dạng HH:MM:SS"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddClose}
            style={{ backgroundColor: "#ff0000", color: "#fff" }}
          >
            Trở lại
          </Button>
          {/* Truyền selectedService vào handleAddSubmit */}
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
