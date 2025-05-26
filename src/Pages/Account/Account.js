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
  Box,
  Select,
  Fab,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import AccountController from "../../Controller/Account/AccountController";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import KeyIcon from "@mui/icons-material/Key";
import { Snackbar, Alert } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import "./Accounts.css";
import AccountModel from "../../Model/Account/AcountModel";
import url from "../../Global/ipconfixad";
const Account = () => {
  const {
    status,
    pagination,
    openEdit,
    openDetail,
    openAdd,
    searchTerm,
    accounts,
    selectedAccount,
    roleMapping,
    genderMapping,
    message,
    setOpenSnackbar,
    openSnackbar,
    filteredStatus,
    handleLock,
    handleDetail,
    handleUnLock,
    setStatus,
    setSelectedAccount,
    handleSearch,
    handlePageChange,
    handleDetailClose,
    handleAddSubmit,
    handleEditSubmit,
    handleEdit,
    handleEditClose,
    handleAddClick,
    handleAddClose,
    resetSelectedAccount,
  } = AccountController(url);

  return (
    <div>
      <Box className="account-topbar">
        <Box className="account-search-container">
          <TextField
            className="account-search-bar"
            label="Tìm kiếm tài khoản"
            variant="outlined"
            fullWidth
            size="medium"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm theo tên tài khoản"
          />
        </Box>
        <Box className="account-dropdown">
          <FormControl className="account-drop" style={{ minWidth: 100 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              sx={{ height: "52px" }}
              size="small"
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value === null ? null : Number(e.target.value)
                )
              }
            >
              <MenuItem value={null} sx={{ fontSize: "12px" }}>
                Tất cả
              </MenuItem>
              <MenuItem value={0} sx={{ fontSize: "12px" }}>
                Người dùng
              </MenuItem>
              <MenuItem value={1} sx={{ fontSize: "12px" }}>
                Quản lý
              </MenuItem>
              <MenuItem value={2} sx={{ fontSize: "12px" }}>
                Nhân viên
              </MenuItem>
              <MenuItem value={3} sx={{ fontSize: "12px" }}>
                Bị khóa
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <div className="account-table-container">
        <TableContainer component={Paper}>
          <Table className="account-table">
            <TableHead className="head-account">
              <TableRow>
                {[
                  "ID",
                  "Tên tài khoản",
                  "Email",
                  "Tên đầy đủ",
                  "Địa chỉ",
                  "Ngày sinh",
                  "Giới tính",
                  "Số điện thoại",
                  "Vai trò",
                  "Hành động",
                ].map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className="body-account">
              {filteredStatus.length > 0 ? (
                filteredStatus.map((data) => {
                  const account = new AccountModel({ ...data });

                  return (
                    <TableRow key={account.uid}>
                      <TableCell>{account.uid}</TableCell>
                      <TableCell>{account.username}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>{account.fullname}</TableCell>
                      <TableCell>{account.address}</TableCell>
                      <TableCell>{account.birthday}</TableCell>
                      <TableCell>{genderMapping[account.gender]}</TableCell>
                      <TableCell>{account.phonenum}</TableCell>
                      <TableCell>{roleMapping[account.status]}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleDetail(account)}
                        >
                          <RemoveRedEyeIcon />
                        </IconButton>
                        <IconButton
                          color="warning"
                          onClick={() => handleEdit(account)}
                        >
                          <EditIcon />
                        </IconButton>
                        {account.status !== 3 && (
                          <IconButton
                            color="error"
                            onClick={() => handleLock(account.uid)}
                            title="Khóa tài khoản"
                          >
                            <LockIcon />
                          </IconButton>
                        )}

                        {account.status === 3 && (
                          <IconButton
                            color="info"
                            onClick={() => handleUnLock(account.uid)}
                            title="Mở khóa tài khoản"
                          >
                            <KeyIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    Không có tài khoản nào được tìm thấy
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

      {/* Dialog Thông tin tài khoản */}
      <Dialog
        open={openDetail}
        onClose={handleDetailClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Thông tin tài khoản</DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  {/* Cặp 2 cột gọn gàng hơn */}
                  {[
                    {
                      label: "Tên tài khoản",
                      value: selectedAccount?.username,
                    },
                    { label: "Email", value: selectedAccount?.email },
                    { label: "Tên đầy đủ", value: selectedAccount?.fullname },
                    {
                      label: "Số điện thoại",
                      value: selectedAccount?.phonenum,
                    },
                    { label: "Địa chỉ", value: selectedAccount?.address },
                    { label: "Ngày sinh", value: selectedAccount?.birthday },
                    {
                      label: "Giới tính",
                      value: selectedAccount?.gender === "male" ? "Nam" : "Nữ",
                    },
                    {
                      label: "Vai trò",
                      value:
                        selectedAccount?.status === 0
                          ? "Người dùng"
                          : selectedAccount?.status === 1
                          ? "Nhân viên"
                          : "Quản lý",
                    },
                  ].map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        color="textSecondary"
                      >
                        {item.label}:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "medium", color: "#333" }}
                      >
                        {item.value || "N/A"}
                      </Typography>
                    </Grid>
                  ))}

                  {/* Hiển thị mật khẩu ẩn */}
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="textSecondary"
                    >
                      Mật khẩu:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "medium", color: "#333" }}
                    >
                      ******
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDetailClose}
            style={{ backgroundColor: "#ff0000", color: "#fff" }}
          >
            Trở lại
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Sửa tài khoản */}
      <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="md">
        <DialogTitle>Sửa tài khoản</DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <>
              <TextField
                label="Tên tài khoản"
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
                label="Email"
                fullWidth
                type="email"
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
                label="Số điện thoại"
                fullWidth
                type="number"
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
                label="Địa chỉ"
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
              <Select
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
      </Dialog>

      {/* Dialog Thêm tài khoản */}
      <Dialog open={openAdd} onClose={handleAddClose} fullWidth maxWidth="md">
        <DialogTitle>Thêm tài khoản</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên tài khoản"
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
            label="Mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            value={selectedAccount?.password || ""}
            onChange={(e) =>
              setSelectedAccount({
                ...selectedAccount,
                password: e.target.value,
              })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={selectedAccount?.email || ""}
            onChange={(e) =>
              setSelectedAccount({ ...selectedAccount, email: e.target.value })
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
            label="Ngày sinh"
            type="date"
            fullWidth
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
          <TextField
            label="Số điện thoại"
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
            label="Địa chỉ"
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
          <Select
            className="select"
            label="Giới tính"
            fullWidth
            margin="normal"
            value={selectedAccount.gender}
            onChange={(e) =>
              setSelectedAccount({ ...selectedAccount, gender: e.target.value })
            }
          >
            <MenuItem value={0}>Nam</MenuItem>
            <MenuItem value={1}>Nữ</MenuItem>
            <MenuItem value={2}>Khác</MenuItem>
          </Select>
          <Select
            className="select"
            label="Vai trò"
            fullWidth
            margin="normal"
            value={selectedAccount.status}
            onChange={(e) =>
              setSelectedAccount({ ...selectedAccount, status: e.target.value })
            }
          >
            <MenuItem value={0}>Người dùng</MenuItem>
            <MenuItem value={1}>Nhân viên</MenuItem>
            <MenuItem value={2}>Quản lý</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddClose}
            style={{ backgroundColor: "#ff0000", color: "#fff" }}
          >
            Trở lại
          </Button>
          <Button
            onClick={() => handleAddSubmit(selectedAccount)}
            style={{ backgroundColor: "#228b22", color: "#fff" }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default Account;
