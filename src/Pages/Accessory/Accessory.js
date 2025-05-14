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
import "./Accessory.css"; // Import style riêng
import url from "../../Global/ipconfixad";
import AccessoryModel from "../../Model/Accessory/AccessoryModel";
import AccessoryController from "../../Controller/Accessory/AccessoryController";
const Accessory = () => {
  const {
    accessorys,
    pagination,
    openEdit,
    openAdd,
    searchTerm,
    selectedAccessory,
    priceRange,
    openSnackbar,
    message,
    expandedRows,
    handlePriceChangeInField,
    fetchAccessorys,
    setOpenSnackbar,
    setMessage,
    handleSearch,
    setSelectedAccessory,
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
  } = AccessoryController(url);

  return (
    <div>
      {/* Thanh tìm kiếm */}
      <Box className="accessory-topbar">
        <Box className="accessory-search-container">
          <TextField
            className="accessory-search-bar"
            label="Tìm kiếm phụ kiện"
            variant="outlined"
            fullWidth
            size="medium"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm theo tên dich vụ"
          />
        </Box>
        <Box className="accessory-dropdown">
          <Typography sx={{ fontSize: 14 }} className="search-text">
            {" "}
            Giá tiền
          </Typography>
          <Slider
            size="small"
            className="accessory-search-price"
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
      <TableContainer component={Paper} className="accessory-table-container">
        <Table aria-label="accessory table" className="accessory-table">
          {/* Tiêu đề bảng*/}
          <TableHead className="head-accessory">
            <TableRow>
              {[
                "ID",
                "Tên phụ tùng",
                "Mô tả",
                "Giá tiền",
                "Số lượng",
                "Hãng sản xuất",
                "Hành động",
              ].map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody className="body-accessory">
            {accessorys && accessorys.length > 0 ? (
              accessorys.map((data) => {
                const accessory = new AccessoryModel({ ...data });
                return (
                  <TableRow key={accessory.accessory_id}>
                    <TableCell>{accessory.accessory_id}</TableCell>
                    <TableCell>{accessory.accessory_name}</TableCell>{" "}
                    <TableCell>
                      {expandedRows[accessory.accessory_id] ? (
                        <>
                          {accessory.description || "Không có mô tả"}{" "}
                          <Button
                            color="primary"
                            size="small"
                            onClick={() => toggleExpand(accessory.accessory_id)}
                          >
                            Thu gọn
                          </Button>
                        </>
                      ) : (
                        <>
                          {accessory.description &&
                          accessory.description.length > 100
                            ? `${accessory.description.slice(0, 100)}...`
                            : accessory.description || "Không có mô tả"}
                          {accessory.description &&
                            accessory.description.length > 100 && (
                              <Button
                                color="primary"
                                size="small"
                                onClick={() =>
                                  toggleExpand(accessory.accessory_id)
                                }
                              >
                                Xem thêm
                              </Button>
                            )}
                        </>
                      )}
                    </TableCell>
                    <TableCell>{formatPrice(accessory.price)}</TableCell>
                    <TableCell>{accessory.quantity}</TableCell>
                    <TableCell>{accessory.supplier}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(accessory)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(accessory.accessory_id)}
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
                  Không có phụ kiện nào được tìm thấy
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
        <DialogTitle>Sửa phụ kiện</DialogTitle>
        <DialogContent>
          {selectedAccessory && (
            <>
              <TextField
                label="Tên phụ kiện"
                fullWidth
                margin="normal"
                value={selectedAccessory?.accessory_name || ""}
                onChange={(e) =>
                  setSelectedAccessory({
                    ...selectedAccessory,
                    accessory_name: e.target.value,
                  })
                }
              />
              <TextField
                label="Mô tả"
                fullWidth
                type="text"
                margin="normal"
                value={selectedAccessory?.description || ""}
                onChange={(e) =>
                  setSelectedAccessory({
                    ...selectedAccessory,
                    description: e.target.value,
                  })
                }
              />
              <TextField
                label="Giá tiền"
                fullWidth
                margin="normal"
                value={formatPrice(selectedAccessory.price)}
                onChange={handlePriceChangeInField}
              />

              <TextField
                label="Số lượng"
                fullWidth
                type="number"
                margin="normal"
                value={selectedAccessory.quantity}
                onChange={(e) =>
                  setSelectedAccessory({
                    ...selectedAccessory,
                    quantity: e.target.value,
                  })
                }
              />
              <TextField
                label="Hãng sản xuất"
                fullWidth
                type="text"
                margin="normal"
                value={selectedAccessory?.supplier || ""}
                onChange={(e) =>
                  setSelectedAccessory({
                    ...selectedAccessory,
                    supplier: e.target.value,
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
        <DialogTitle>Thêm phụ kiện</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên phụ kiện"
            fullWidth
            type="text"
            margin="normal"
            onChange={(e) =>
              setSelectedAccessory({
                ...selectedAccessory,
                accessory_name: e.target.value,
              })
            }
          />
          <TextField
            label="Mô tả"
            fullWidth
            type="text"
            margin="normal"
            onChange={(e) =>
              setSelectedAccessory({
                ...selectedAccessory,
                description: e.target.value,
              })
            }
          />
          <TextField
            label="Giá tiền"
            fullWidth
            margin="normal"
            value={formatPrice(selectedAccessory.price)}
            onChange={handlePriceChangeInField}
          />

          <TextField
            label="Số lượng"
            fullWidth
            type="number"
            margin="normal"
            value={selectedAccessory.quantity}
            onChange={(e) =>
              setSelectedAccessory({
                ...selectedAccessory,
                quantity: e.target.value,
              })
            }
          />

          <TextField
            label="Hãng sản xuất"
            fullWidth
            type="text"
            margin="normal"
            onChange={(e) =>
              setSelectedAccessory({
                ...selectedAccessory,
                supplier: e.target.value,
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
            onClick={() => handleAddSubmit(selectedAccessory)}
            style={{ backgroundColor: "#228b22", color: "#fff" }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút thêm phụ kiện */}
      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default Accessory;
