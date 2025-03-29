import { useState, useEffect } from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
const CenterController = (url) => {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState({
    gara_name: "",
    gara_address: "",
    phone: "",
    gara_img: "",
    x_location: 0,
    y_location: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    gara_name: "",
    gara_address: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  useEffect(() => {
    fetchCenter();
  }, []);

  const fetchCenter = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const response = await axios.get(
        `${url}apihm/Admin/Center/get_center.php`,
        {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      if (data && Array.isArray(data.data)) {
        setCenters(data.data);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          limit,
        });
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải gara :", error);
    }
  };

  const checkData = (newCenter) => {
    if (
      !newCenter.gara_name ||
      !newCenter.gara_address ||
      !newCenter.phone ||
      !newCenter.gara_img ||
      !newCenter.x_location ||
      !newCenter.y_location
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return false;
    }
    return true;
  };
  const resetSelectedCenter = () =>
    setSelectedCenter({
      gara_name: "",
      gara_address: "",
      phone: 0,
      gara_img: "",
      x_location: 0,
      y_location: 0,
    });

  const searchCenters = async (searchParams) => {
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await axios.get(
        `${url}apihm/Admin/Center/tktrungtam.php?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sử dụng token đã lấy
          },
        }
      );
      const centers = response.data.centers;
      console.log("API Response:", centers);
      setCenters(centers);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm trung tâm:", error);
    }
  };

  useEffect(() => {
    const { gara_name, gara_address } = searchTerm;
    if (gara_name || gara_address) {
      // console.log("Searching with:", searchTerm);
      searchCenters(searchTerm);
    } else {
      fetchCenter();
    }
  }, [searchTerm]);

  const handleSearch = (event, key, value) => {
    setSearchTerm((prev) => ({ ...prev, [key]: value }));
    fetchCenter(1, pagination.limit);
  };

  const handlePageChange = (event, value) => {
    fetchCenter(value, pagination.limit);
  };

  const handleAddSubmit = async (newCenter) => {
    if (!checkData(selectedCenter)) return;
    const payload = { ...newCenter };
    const encodedData = btoa(encodeURIComponent(JSON.stringify(payload)));
    try {
      const response = await axios.post(
        `${url}apihm/Admin/Center/add_center.php`,
        {
          data: encodedData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sử dụng token đã lấy
          },
        }
      );

      if (response.data.success) {
        setMessage("Thêm gara thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }

      setOpenAdd(false);
      fetchCenter();
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
    }
  };
  const handleEditSubmit = async () => {
    if (!checkData(selectedCenter)) return;
    const payload = { ...selectedCenter };
    const encodedData = btoa(encodeURIComponent(JSON.stringify(payload)));
    try {
      const response = await axios.post(
        `${url}apihm/Admin/Center/edit_center.php`,
        {
          data: encodedData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sử dụng token đã lấy
          },
        }
      );
      if (response.data.success) {
        setMessage("Sửa trung tâm thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
      setOpenEdit(false);
      fetchCenter();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa trung tâm này không?"))
      return;

    try {
      const response = await axios.delete(
        `${url}apihm/Admin/Center/delete_center.php`,
        {
          data: { gara_id: id },
          headers: {
            Authorization: `Bearer ${token}`, // Sử dụng token đã lấy
          },
        }
      );
      if (response.data.error && response.data.error.code === 0) {
        setMessage("Xóa gara thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
      setCenters(centers.filter((center) => center.gara_id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };
  const handleAddClick = () => setOpenAdd(true);
  const handleAddClose = () => setOpenAdd(false);

  const handleEdit = (service) => {
    setSelectedCenter(service);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    resetSelectedCenter();
  };
  return {
    centers,
    pagination,
    openEdit,
    openAdd,
    searchTerm,
    selectedCenter,
    openSnackbar,
    message,
    setOpenSnackbar,
    setMessage,
    fetchCenter,
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
  };
};
export default CenterController;
