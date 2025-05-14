import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiService from "../../services/ApiCaller";
import url from "../../Global/ipconfixad";
import AccessoryController from "../../Controller/Accessory/AccessoryController";

const AddPartsModal = ({
  isOpen,
  onClose,
  selectedAppointmentId,
  addPartsToAppointment,
}) => {
  const [selectedPart, setSelectedPart] = useState(null);
  const [partQuantity, setPartQuantity] = useState("");
  const [newParts, setNewParts] = useState([]); // Danh sách phụ tùng đã chọn
  const [availableParts, setAvailableParts] = useState([]); // Danh sách phụ tùng có sẵn
  const [quantityError, setQuantityError] = useState("");
  const { formatPrice } = AccessoryController(url);

  useEffect(() => {
    fetchAccessory();
  }, []);

  const fetchAccessory = async () => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Accessory/get_access_in_appoint.php`
      );
      if (response.data && Array.isArray(response.data.data)) {
        setAvailableParts(response.data.data);
      } else {
        console.error("Lỗi khi tải dữ liệu phụ tùng:", response.data?.message);
        setAvailableParts([]);
      }
    } catch (error) {
      console.error("Lỗi khi load phụ tùng:", error);
      setAvailableParts([]);
    }
  };

  // thay đổi khi chọn phụ tùng
  const handlePartChange = (event) => {
    setSelectedPart(event.target.value);
    setPartQuantity("");
    setQuantityError("");
  };

  // thay đổi sl
  const handleQuantityChange = (event) => {
    const value = event.target.value;
    setPartQuantity(value);
    if (!value || Number(value) <= 0) {
      setQuantityError("Số lượng phải lớn hơn 0");
    } else {
      setQuantityError("");
    }
  };

  // thêm phụ tùng vào danh sách
  const handleAddPartToList = () => {
    if (!selectedPart || quantityError) return;
    const quantityNum = Number(partQuantity);
    if (quantityNum <= 0) return;

    const partObj = {
      id: selectedPart.accessory_id,
      accessory_name: selectedPart.accessory_name,
      price: selectedPart.price,
      quantity: quantityNum,
    };

    // Kiểm tra trùng lặp
    if (newParts.some((p) => p.id === partObj.id)) {
      alert("Phụ tùng đã có trong danh sách");
      return;
    }

    setNewParts([...newParts, partObj]);
    setSelectedPart(null);
    setPartQuantity("");
  };

  // xóa phụ tùng khỏi danh sách
  const handleRemovePart = (index) => {
    setNewParts(newParts.filter((_, i) => i !== index));
  };
  const handleSubmitParts = () => {
    // phụ tùng đang chọn nhưng chưa thêm vào danh sách
    if (selectedPart) {
      alert("Bạn chưa thêm phụ tùng vào danh sách");
      return;
    }

    //Nếu danh sách trống
    if (newParts.length === 0) {
      alert("Danh sách phụ tùng rỗng");
      return;
    }
    // Mọi thứ OK
    addPartsToAppointment(selectedAppointmentId, newParts);
  };
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Thêm Phụ Tùng</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="part-name-label">Tên phụ tùng</InputLabel>
          <Select
            labelId="part-name-label"
            id="part-name"
            value={selectedPart || ""}
            label="Tên phụ tùng"
            onChange={handlePartChange}
          >
            {availableParts.map((part) => (
              <MenuItem key={part.accessory_id} value={part}>
                {part.accessory_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Số lượng"
          type="number"
          value={partQuantity}
          onChange={handleQuantityChange}
          fullWidth
          margin="normal"
          error={!!quantityError}
          helperText={quantityError}
        />

        {selectedPart && (
          <TextField
            label="Đơn giá"
            value={formatPrice(selectedPart.price)}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPartToList}
        >
          Thêm vào danh sách
        </Button>

        <TableContainer component={Paper} style={{ marginTop: 16 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên phụ tùng</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Thành tiền</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newParts.map((part, index) => (
                <TableRow key={index}>
                  <TableCell>{part.accessory_name}</TableCell>
                  <TableCell>{part.quantity}</TableCell>
                  <TableCell>{formatPrice(part.price)}</TableCell>
                  <TableCell>
                    {formatPrice(part.quantity * part.price)}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleRemovePart(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ backgroundColor: "#ff0000", color: "#fff" }}
        >
          Đóng
        </Button>

        <Button
          onClick={handleSubmitParts}
          sx={{ backgroundColor: "#228b22", color: "#fff" }}
        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPartsModal;
