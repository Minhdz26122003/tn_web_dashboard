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

import {
  fetchAccessPayments,
  deleteAccessPayment,
} from "../../Controller/Accessory/AccessPayController";
import "./viewAccessPay.css";

const viewAccessPay = ({ open, onClose, appointmentId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (open && appointmentId) {
      setLoading(true);
      fetchAccessPayments(appointmentId)
        .then((data) => setItems(data))
        .finally(() => setLoading(false));
    }
  }, [open, appointmentId]);

  const handleDelete = async (accessoryId) => {
    if (!window.confirm("Bạn có chắc muốn xóa phụ tùng này khỏi hoá đơn?"))
      return;
    const ok = await deleteAccessPayment(appointmentId, accessoryId);
    if (ok) {
      setMessage("Đã xóa thành công phụ tùng khỏi hóa đơn!");
      setItems((prev) => prev.filter((it) => it.accessory_id !== accessoryId));
    } else {
      setMessage("Xóa thất bại, vui lòng thử lại.");
    }
    setOpenSnackbar(true);
  };

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
