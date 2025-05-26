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
import "./TypeService.css";
import url from "../../Global/ipconfixad";
import Pagination from "@mui/material/Pagination";
import TypeController from "../../Controller/TypeService/TypeServiceController";
import TypeModel from "../../Model/TypeService/TypeServiceModel";
const Centers = () => {
  const {
    types,
    pagination,
    openEdit,
    openAdd,
    searchTerm,
    selectedType,
    openSnackbar,
    message,
    setOpenSnackbar,
    setMessage,
    fetchType,
    handleSearch,
    setSelectedType,
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
    resetSelectedType,
  } = TypeController(url);

  return (
    <div>
      {/* Thanh tìm kiếm */}

      <Box className="type-search-bar">
        <TextField
          className="name-search-bar"
          label="Tìm kiếm theo tên type"
          variant="outlined"
          size="medium"
          value={searchTerm.type_name}
          onChange={(e) => handleSearch("type_name", e.target.value)}
          placeholder="Nhập tên type"
        />
      </Box>

      <TableContainer component={Paper} className="type-table-container">
        <Table aria-label="type table" className="type-table">
          {/* Tiêu đề bảng*/}
          <TableHead className="head-type">
            <TableRow>
              {["ID", "Tên danh mục dịch vụ", "Hành động"].map(
                (header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody className="body-type">
            {types && types.length > 0 ? (
              types.map((data) => {
                const type = new TypeModel({ ...data });

                return (
                  <TableRow key={type.type_id}>
                    <TableCell>{type.type_id}</TableCell>
                    <TableCell>{type.type_name}</TableCell>

                    <TableCell className="type-table-actions">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(type)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(type.type_id)}
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
                  Không có type nào đươc tìm thấy
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
        <DialogTitle>Sửa thông tin type</DialogTitle>
        <DialogContent>
          {selectedType && (
            <>
              <TextField
                label="Tên type"
                fullWidth
                margin="normal"
                value={selectedType.type_name}
                onChange={(e) =>
                  setSelectedType({
                    ...selectedType,
                    type_name: e.target.value,
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
            label="Tên type"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedType({
                ...selectedType,
                type_name: e.target.value,
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
            onClick={() => handleAddSubmit(selectedType)}
            style={{ backgroundColor: "#228b22", color: "#fff" }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút thêm  */}
      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default Centers;
