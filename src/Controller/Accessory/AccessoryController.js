import { useState, useEffect } from "react";
import axios from "axios";
import ApiService from "../../services/ApiCaller";
import AccessoryModel from "../../Model/Accessory/AccessoryModel";

const AccessoryController = (url) => {
  const [accessorys, setAccessorys] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedAccessory, setSelectedAccessory] = useState({
    accessory_name: "",
    description: "",
    price: 0,
    quantity: 0,
    supplier: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [expandedRows, setExpandedRows] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAccessorys(1, pagination.limit);
  }, []);

  const fetchAccessorys = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Accessory/get_access.php`,
        {
          params: { page, limit },
        }
      );
      const data = response.data;
      if (data && Array.isArray(data.data)) {
        const accessory_data = data.data.map(
          (ser) => new AccessoryModel({ ...ser })
        );
        setAccessorys(accessory_data);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          limit,
        });
      } else {
        setAccessorys([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải phụ kiện:", error);
    }
  };

  const checkData = (accessoryData) => {
    if (
      !accessoryData.accessory_name ||
      !accessoryData.description ||
      !accessoryData.quantity ||
      !accessoryData.price ||
      !accessoryData.supplier
    ) {
      setMessage("Vui lòng điền đầy đủ thông tin bắt buộc!");
      setOpenSnackbar(true);
      return false;
    }
    const numericPrice = parseInt(
      accessoryData.price.toString().replace(/\D/g, ""),
      10
    );

    if (isNaN(numericPrice) || numericPrice < 0) {
      setMessage("Giá tiền không hợp lệ!");
      setOpenSnackbar(true);
      return false;
    }

    return true;
  };
  const resetSelectedAccessory = () =>
    setSelectedAccessory({
      accessory_name: "",
      description: "",
      price: 0,
      quantity: 0,
      supplier: "",
    });

  const searchAccessorys = async (accessory_name, priceRange) => {
    try {
      const [minPrice, maxPrice] = priceRange;
      const response = await ApiService.get(
        `${url}apihm/Admin/Accessory/search_access.php`,
        {
          params: { accessory_name, minPrice, maxPrice },
        }
      );
      const access_data = (response.data.accessorys || []).map(
        (ser) => new AccessoryModel({ ...ser })
      );
      setAccessorys(access_data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm phụ kiện", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm || priceRange) {
        await searchAccessorys(searchTerm, priceRange);
      } else {
        await fetchAccessorys(1, pagination.limit);
      }
    };
    fetchData();
  }, [searchTerm, priceRange]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setAccessorys([]);
    fetchAccessorys(1, pagination.limit);
  };

  const handlePageChange = (event, value) => {
    fetchAccessorys(value, pagination.limit);
  };

  const encodeBase64 = (obj) => {
    return btoa(encodeURIComponent(JSON.stringify(obj)));
  };

  const handleAddSubmit = async (newAccessory) => {
    if (!checkData(selectedAccessory)) return;
    const payload = {
      ...newAccessory,
    };

    const encodedData = encodeBase64(payload);
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Accessory/add_access.php`,
        {
          data: encodedData,
        }
      );

      if (response.data.error && response.data.error.code === 0) {
        setMessage("Thêm phụ kiện thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }

      setOpenAdd(false);
      fetchAccessorys(1, pagination.limit);
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
    }
  };

  const handleEditSubmit = async () => {
    if (!checkData(selectedAccessory)) return;

    const payload = {
      ...selectedAccessory,
    };

    const encodedData = encodeBase64(payload);
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Accessory/edit_access.php`,
        {
          data: encodedData,
        }
      );
      if (response.data.success) {
        setMessage("Sửa phụ kiện thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
      setOpenEdit(false);
      fetchAccessorys(1, pagination.limit);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phụ kiện này không?"))
      return;

    try {
      const response = await ApiService.delete(
        `${url}apihm/Admin/Accessory/delete_access.php`,
        {
          data: { accessory_id: id },
        }
      );
      if (response.data.success) {
        setMessage("Xóa phụ kiện thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
      setAccessorys(
        accessorys.filter((accessory) => accessory.accessory_id !== id)
      );
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  const handleAddClick = () => {
    resetSelectedAccessory();
    setOpenAdd(true);
  };
  const handleAddClose = () => setOpenAdd(false);

  const handleEdit = (accessory) => {
    setSelectedAccessory(accessory);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    resetSelectedAccessory();
  };
  const formatPrice = (giatri) => {
    if (!giatri) return "0";
    const numericValue =
      typeof giatri === "string"
        ? parseInt(giatri.replace(/\D/g, ""), 10)
        : giatri;
    return numericValue.toLocaleString("vi-VN");
  };
  const handlePriceChangeInField = (e) => {
    const value = e.target.value;
    setSelectedAccessory({
      ...selectedAccessory,
      price: value,
    });
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return {
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
    resetSelectedAccessory,
  };
};
export default AccessoryController;
