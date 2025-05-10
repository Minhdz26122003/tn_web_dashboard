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
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import "./centers.css";
import url from "../../Global/ipconfixad";
import Pagination from "@mui/material/Pagination";
import CenterController from "../../Controller/Center/CenterController";
import CenterModel from "../../Model/Center/CenterModel";
const Centers = () => {
  const {
    centers,
    pagination,
    openEdit,
    openAdd,
    searchTerm,
    selectedCenter,
    openSnackbar,
    message,
    selectedFile,
    imagePreviewUrl,
    handleFileChange,
    setOpenSnackbar,
    fetchCenter,
    setMessage,
    handleSearch,
    setSelectedCenter,
    handleAddSubmit,
    handleAddClick,
    handleAddClose,
    handlePageChange,
    handleEditSubmit,
    handleEdit,
    handleEditClose,
    handleDelete,
    setOpenEdit,
    setOpenAdd,
    setSearchTerm,
    resetSelectedCenter,
  } = CenterController(url);

  return (
    <div>
      {/* Thanh tìm kiếm */}

      <Box className="center-search-bar">
        <TextField
          className="name-search-bar"
          label="Tìm kiếm theo tên gara"
          variant="outlined"
          size="medium"
          value={searchTerm.gara_name}
          onChange={(e) => handleSearch("gara_name", e.target.value)}
          placeholder="Nhập tên gara"
        />

        {/* Ô tìm kiếm theo địa chỉ */}
        <TextField
          className="address-search-bar"
          label="Tìm kiếm theo địa chỉ"
          variant="outlined"
          size="medium"
          value={searchTerm.gara_address}
          onChange={(e) => handleSearch("gara_address", e.target.value)}
          placeholder="Nhập địa chỉ"
        />
      </Box>

      <TableContainer component={Paper} className="center-table-container">
        <Table aria-label="center table" className="center-table">
          {/* Tiêu đề bảng*/}
          <TableHead className="head-center">
            <TableRow>
              {[
                "ID",
                "Tên gara",
                "Địa chỉ",
                "Số điện thoại",
                "Email",
                "Hình ảnh",
                "Tọa độ X",
                "Tọa độ Y",
                "Hành động",
              ].map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {centers && centers.length > 0 ? (
              centers.map((data) => {
                const center = new CenterModel({ ...data });

                return (
                  <TableRow key={center.gara_id}>
                    <TableCell>{center.gara_id}</TableCell>
                    <TableCell>{center.gara_name}</TableCell>
                    <TableCell>{center.gara_address}</TableCell>
                    <TableCell>{center.phone}</TableCell>
                    <TableCell>{center.email}</TableCell>
                    <TableCell>
                      <img
                        src={center.gara_img}
                        alt={center.gara_name}
                        style={{ width: "100px", height: "auto" }}
                      />
                    </TableCell>
                    <TableCell>{center.x_location}</TableCell>
                    <TableCell>{center.y_location}</TableCell>
                    <TableCell className="center-table-actions">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(center)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(center.gara_id)}
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
                  Không có gara nào đươc tìm thấy
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
        <DialogTitle>Sửa thông tin gara</DialogTitle>
        <DialogContent>
          {selectedCenter && (
            <>
              <TextField
                label="Tên gara"
                fullWidth
                margin="normal"
                value={selectedCenter.gara_name}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    gara_name: e.target.value,
                  })
                }
              />
              <TextField
                label="Địa chỉ"
                fullWidth
                margin="normal"
                value={selectedCenter.gara_address}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    gara_address: e.target.value,
                  })
                }
              />
              <TextField
                label="Số điện thoại"
                fullWidth
                type="number"
                margin="normal"
                value={selectedCenter.phone}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    phone: e.target.value,
                  })
                }
              />
              <TextField
                label="Email"
                fullWidth
                type="email"
                margin="normal"
                value={selectedCenter.email}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    email: e.target.value,
                  })
                }
              />
              {/* Phần chọn ảnh mới */}
              <Box sx={{ margin: "normal", marginTop: 2 }}>
                <Typography variant="subtitle1">Hình ảnh gara:</Typography>
                {/* Input file ẩn đi */}
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="edit-gara-image-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                {/* Nút để kích hoạt input file */}
                <label htmlFor="edit-gara-image-upload">
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
                      alt="Ảnh gara xem trước"
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
                  selectedCenter &&
                  !selectedCenter.gara_img && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      Chưa có ảnh nào cho gara này và chưa chọn ảnh mới.
                    </Typography>
                  )}
              </Box>

              {/* Trường text "Hình ảnh" ban đầu - có thể giữ lại để hiển thị URL (chỉ đọc) hoặc bỏ đi */}
              {/* Giữ lại để hiển thị URL hiện tại/mới cho Admin tiện theo dõi */}

              <TextField
                label="Hình ảnh"
                fullWidth
                margin="normal"
                value={selectedCenter.gara_img || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Tọa độ X"
                fullWidth
                type="number"
                margin="normal"
                value={selectedCenter.x_location}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    x_location: e.target.value,
                  })
                }
              />
              <TextField
                label="Tọa độ Y"
                fullWidth
                type="number"
                margin="normal"
                value={selectedCenter.y_location}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    y_location: e.target.value,
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
        <DialogTitle>Thêm trung tâm</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên gara"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                gara_name: e.target.value,
              })
            }
          />
          <TextField
            label="Địa chỉ"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                gara_address: e.target.value,
              })
            }
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            type="number"
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                phone: e.target.value,
              })
            }
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                email: e.target.value,
              })
            }
          />
          {/* Phần chọn ảnh mới */}
          <Box sx={{ margin: "normal", marginTop: 2 }}>
            <Typography variant="subtitle1">Hình ảnh gara:</Typography>
            {/* Input file ẩn đi */}
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="add-gara-image-upload"
              type="file"
              onChange={handleFileChange}
            />
            {/* Nút để kích hoạt input file */}
            <label htmlFor="add-gara-image-upload">
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
                  alt="Ảnh gara xem trước"
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
            label="Tọa độ X"
            fullWidth
            type="number"
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                x_location: e.target.value,
              })
            }
          />
          <TextField
            label="Tọa độ Y"
            fullWidth
            type="number"
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                y_location: e.target.value,
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
            onClick={() => handleAddSubmit(selectedCenter)}
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

export default Centers;
