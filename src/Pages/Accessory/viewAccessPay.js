import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiService from "../../services/ApiCaller";
import url from "../../Global/ipconfixad";
import "./viewAccessPay.css";

const viewAccessPay = ({ open, onClose, appointmentId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (open && appointmentId) {
      fetchItems();
    }
  }, [open, appointmentId]);

  const fetchItems = () => {
    setLoading(true);
    ApiService.get(`${url}apihm/Admin/AccessPayment/get_access_pay.php`, {
      params: { appointment_id: appointmentId },
    })
      .then((res) => {
        if (res.data.success) setItems(res.data.parts);
        else setItems([]);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (accessoryId) => {
    if (!window.confirm("Bạn có chắc muốn xóa phụ tùng này khỏi hoá đơn?"))
      return;
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/AccessPayment/delete_access_pay.php`,
        {
          appointment_id: appointmentId,
          accessory_id: accessoryId,
        }
      );
      if (response.data.success) {
        setMessage("Đã xóa thành công phụ tùng khỏi hóa đơn!");
        setOpenSnackbar(true);
        setItems((prev) =>
          prev.filter((it) => it.accessory_id !== accessoryId)
        );
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Tính tổng tiền
  const total = items.reduce((sum, it) => sum + it.quantity * it.unit_price, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Hoá đơn phụ tùng</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : items.length > 0 ? (
          <Table className="access-table">
            <TableHead className="head-access">
              <TableRow>
                <TableCell>Tên phụ tùng</TableCell>
                <TableCell align="right">Số lượng</TableCell>
                <TableCell align="right">Đơn giá</TableCell>
                <TableCell align="right">Thành tiền</TableCell>
                <TableCell align="center">Thao tác</TableCell>
                {/* cột mới */}
              </TableRow>
            </TableHead>
            <TableBody className="body-access">
              {items.map((it, idx) => (
                <TableRow key={idx}>
                  <TableCell>{it.accessory_name}</TableCell>
                  <TableCell align="right">{it.quantity}</TableCell>
                  <TableCell align="right">
                    {it.unit_price.toLocaleString()} đ
                  </TableCell>
                  <TableCell align="right">
                    {(it.quantity * it.unit_price).toLocaleString()} đ
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(it.accessory_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography fontWeight="bold" color="error">
                    Tổng cộng
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight="bold" color="error">
                    {total.toLocaleString()} đ
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <Typography>Chưa có phụ tùng nào trong hóa đơn.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default viewAccessPay;
