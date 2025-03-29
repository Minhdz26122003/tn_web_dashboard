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
          label="Tìm kiếm theo tên trung tâm"
          variant="outlined"
          size="medium"
          value={searchTerm.gara_name}
          onChange={(e) => handleSearch("gara_name", e.target.value)}
          placeholder="Nhập tên trung tâm"
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
              <TableCell>ID</TableCell>
              <TableCell>Tên trung tâm</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tọa độ X</TableCell>
              <TableCell>Tọa độ Y</TableCell>

              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {centers && centers.length > 0 ? (
              centers.map((center) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có trung tâm nào đươc tìm thấy
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
        <DialogTitle>Sửa trung tâm</DialogTitle>
        <DialogContent>
          {selectedCenter && (
            <>
              <TextField
                label="Tên trung tâm"
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
                margin="normal"
                value={selectedCenter.email}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    email: e.target.value,
                  })
                }
              />
              <TextField
                label="Hình ảnh"
                fullWidth
                margin="normal"
                value={selectedCenter.gara_img}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    gara_img: e.target.value,
                  })
                }
              />
              <TextField
                label="Tọa độ X"
                fullWidth
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
            label="Tên trung tâm"
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
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                email: e.target.value,
              })
            }
          />
          {/* Thay đổi: Nhập URL hình ảnh */}
          <TextField
            label="URL Hình ảnh"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                gara_img: e.target.value, // Nhập URL hình ảnh
              })
            }
          />
          <TextField
            label="Tọa độ X"
            fullWidth
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
