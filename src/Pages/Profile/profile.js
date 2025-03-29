import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Alert,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  Snackbar,
} from "@mui/material";
import axios from "axios";

import bg from "../../Assets/images/bg-profile.jpeg";
import avar from "../../Assets/images/team-2.jpg";
import url from "../../Global/ipconfixad";
import ProfileController from "../../Controller/Profile/ProfileController";

const Profile = ({ user }) => {
  const {
    username,
    email,
    phonenum,
    address,
    birthday,
    fullname,
    gender,
    status,
    selectedAccount,
    avatar,
    isDialogOpen,
    snackbarOpen,
    snackbarMessage,
    openEdit,
    currentPassword,
    newPassword,
    confirmPassword,
    error,
    genderMapping,
    genderValue,
    setSnackbarOpen,
    roleMapping,
    setSelectedAccount,
    handleEdit,
    handleEditClose,
    handleEditSubmit,
    handleOpenDialog,
    handleCloseDialog,
    handleChangePassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
  } = ProfileController(user, url);

  if (!user) {
    return (
      <Typography>Vui lòng đăng nhập để xem thông tin cá nhân.</Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: "1290px", margin: "0 auto", p: 2 }}>
      {/* Ảnh bìa (Cover Image) */}
      <Box
        sx={{
          position: "relative",
          height: 300,
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        {/* Avatar chồng lên ảnh bìa */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-120px",
            left: "10%",
            transform: "translateX(-50%)",
          }}
        >
          <Avatar
            sx={{ width: 150, height: 150, border: "3px solid white" }}
            src={avar}
          />
          {/* Tên người dùng */}
          <Box sx={{ textAlign: "start", ml: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {username || "User Name"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email || "example@gmail.com"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Khu vực thông tin chính */}
      <Paper
        sx={{
          mt: 8,
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        {/* Nút Sửa & Đổi mật khẩu bên phải */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
            onClick={handleEdit}
          >
            Sửa thông tin
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2e7d32",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1b5e20",
              },
            }}
            onClick={handleOpenDialog}
          >
            Đổi mật khẩu
          </Button>
        </Box>

        {/* Thông tin chi tiết */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "normal", fontSize: 20 }}
            >
              Thông tin cơ bản
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ mt: 2 }}>
                <strong>Tên đăng nhập:</strong> {username}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Tên đầy đủ:</strong> {fullname}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Địa chỉ:</strong> {address}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Ngày sinh:</strong> {birthday}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Giới tính:</strong>{" "}
                {genderMapping[genderValue] !== undefined
                  ? genderMapping[genderValue]
                  : "Không xác định"}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Vai trò:</strong> {roleMapping[status]}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "normal", fontSize: 20 }}
            >
              Liên hệ
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ mt: 2 }}>
                <strong>Email:</strong> {email}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Số điện thoại:</strong> {phonenum}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Dialog Đổi mật khẩu */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Đổi Mật Khẩu</DialogTitle>
        <DialogContent>
          <TextField
            label="Mật khẩu hiện tại"
            type="password"
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Xác nhận mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            style={{ backgroundColor: "#ff0000", color: "#ffffff" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleChangePassword}
            style={{ backgroundColor: "#228b22", color: "#ffffff" }}
          >
            Đổi Mật Khẩu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Sửa thông tin */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Sửa thông tin cá nhân</DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={selectedAccount?.username || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    username: e.target.value,
                  })
                }
              />
              <TextField
                label="Tên đầy đủ"
                fullWidth
                margin="normal"
                value={selectedAccount?.fullname || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    fullname: e.target.value,
                  })
                }
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={selectedAccount?.email || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    email: e.target.value,
                  })
                }
              />
              <TextField
                label="Phone"
                fullWidth
                margin="normal"
                value={selectedAccount?.phonenum || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    phonenum: e.target.value,
                  })
                }
              />
              <TextField
                label="Address"
                fullWidth
                margin="normal"
                value={selectedAccount?.address || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    address: e.target.value,
                  })
                }
              />
              <TextField
                label="Ngày sinh"
                fullWidth
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={selectedAccount?.birthday || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    birthday: e.target.value,
                  })
                }
              />
              <Select
                className="select"
                label="Giới tính"
                fullWidth
                margin="normal"
                value={selectedAccount?.gender}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    gender: e.target.value,
                  })
                }
              >
                <MenuItem value={0}>Nam</MenuItem>
                <MenuItem value={1}>Nữ</MenuItem>
                <MenuItem value={2}>Khác</MenuItem>
              </Select>
              {/* <Select
                className="select"
                label="Vai trò"
                fullWidth
                margin="normal"
                value={selectedAccount?.status}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    status: e.target.value,
                  })
                }
              >
                <MenuItem value={0}>Người dùng</MenuItem>
                <MenuItem value={1}>Quản lý</MenuItem>
                <MenuItem value={2}>Nhân viên</MenuItem>
                <MenuItem value={3}>Bị khóa</MenuItem>
              </Select> */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditClose}
            style={{ backgroundColor: "#ff0000", color: "#ffffff" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleEditSubmit}
            style={{ backgroundColor: "#228b22", color: "#ffffff" }}
          >
            Lưu thông tin
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={
            snackbarMessage.includes("thành công") ? "success" : "error"
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
