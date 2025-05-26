import { useState, useEffect } from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import ApiService from "../../services/ApiCaller";
import TypeModel from "../../Model/TypeService/TypeServiceModel";

const TypeController = (url) => {
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState({
    type_name: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    type_name: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchType(1, pagination.limit);
  }, []);

  const fetchType = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/TypeService/get_type.php`,
        {
          params: { page, limit },
        }
      );
      const data = response.data;
      if (data && Array.isArray(data.data)) {
        const type_data = data.data.map((type) => new TypeModel({ ...type }));
        setTypes(type_data);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          limit,
        });
      } else {
        setTypes([]);
        setPagination({ currentPage: 1, totalPages: 1, limit });
      }
    } catch (error) {
      console.error("Lỗi khi tải type :", error);
    }
  };

  const checkData = (dataToCheck) => {
    // 1. Kiểm tra các trường không được để trống
    if (!dataToCheck.type_name?.toString().trim()) {
      setMessage("Vui lòng điền đầy đủ thông tin bắt buộc!");
      setOpenSnackbar(true);
      return false;
    }

    return true;
  };
  const resetSelectedType = () =>
    setSelectedType({
      type_name: "",
    });

  const searchTypes = async (searchParams) => {
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await ApiService.get(
        `${url}apihm/Admin/TypeService/search_type.php?${query}`
      );
      const type_data = (response.data.service_type || []).map(
        // Sửa lỗi ở đây
        (type) => new TypeModel({ ...type })
      );
      setTypes(type_data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm danh mục:", error);
    }
  };

  useEffect(() => {
    const { type_name } = searchTerm;
    const delayDebounceFn = setTimeout(async () => {
      if (type_name) {
        await searchTypes(searchTerm);
      } else {
        await fetchType(1, pagination.limit);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pagination.limit]);

  const handleSearch = (key, value) => {
    setSearchTerm((prev) => ({ ...prev, [key]: value }));
    // Không cần gọi fetchType ở đây, useEffect sẽ tự động gọi searchTypes
  };

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({ ...prev, currentPage: value }));
    fetchType(value, pagination.limit);
  };

  const encodeBase64 = (obj) => {
    return btoa(encodeURIComponent(JSON.stringify(obj)));
  };

  // add
  const handleAddSubmit = async (newType) => {
    if (!checkData(newType)) return; // Sửa lỗi ở đây

    const payload = {
      ...newType,
    };

    const encodedData = encodeBase64(payload);
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/TypeService/add_type.php`,
        {
          data: encodedData,
        }
      );

      if (response.data.error && response.data.error.code === 0) {
        setMessage("Thêm type thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }

      setOpenAdd(false);
      resetSelectedType(); // Đặt lại giá trị sau khi thêm
      fetchType();
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
      setMessage("Lỗi khi thêm type!");
      setOpenSnackbar(true);
    }
  };
  //edit
  const handleEditSubmit = async () => {
    if (!checkData(selectedType)) return; // Sửa lỗi ở đây

    const payload = {
      ...selectedType, // Sửa lỗi ở đây, phải là selectedType
    };

    const encodedData = encodeBase64(payload);
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/TypeService/edit_type.php`,
        {
          data: encodedData,
        }
      );
      if (response.data.success) {
        setMessage("Sửa type thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
      setOpenEdit(false);
      resetSelectedType(); // Đặt lại giá trị sau khi sửa
      fetchType();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      setMessage("Lỗi khi sửa type!");
      setOpenSnackbar(true);
    }
  };

  //delete
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?"))
      return;

    try {
      const response = await ApiService.delete(
        `${url}apihm/Admin/TypeService/delete_type.php`,
        {
          data: { type_id: id },
        }
      );
      if (response.data.success) {
        setMessage("Xóa type thành công!");
        setOpenSnackbar(true);
        setTypes(types.filter((type) => type.type_id !== id));
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      setMessage("Lỗi khi xóa type!");
      setOpenSnackbar(true);
    }
  };
  const handleAddClick = () => {
    resetSelectedType(); // Đặt lại giá trị khi mở form thêm mới
    setOpenAdd(true);
  };
  const handleAddClose = () => setOpenAdd(false);

  const handleEdit = (service) => {
    setSelectedType(service);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    resetSelectedType();
  };
  return {
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
  };
};
export default TypeController;
