import { useState, useEffect } from "react";
import axios from "axios";

const ServiceController = (url) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState({
    service_name: "",
    description: "",
    price: "",
    service_img: "",
    time: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [expandedRows, setExpandedRows] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const response = await axios.get(
        `${url}apihm/Admin/Service/get_service.php`,
        {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      if (data && Array.isArray(data.data)) {
        setServices(data.data);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          limit,
        });
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dịch vụ:", error);
    }
  };

  const checkData = (newService) => {
    if (
      !newService.service_name ||
      !newService.description ||
      !newService.price ||
      !newService.service_img ||
      !newService.time
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return false;
    }
    return true;
  };
  const resetSelectedService = () =>
    setSelectedService({
      service_name: "",
      description: "",
      price: 0,
      service_img: "",
      time: 0,
    });

  const searchServices = async (service_name, priceRange) => {
    try {
      const [minPrice, maxPrice] = priceRange;
      const response = await axios.get(
        `${url}apihm/Admin/Service/search_service.php`,
        {
          params: { service_name, minPrice, maxPrice },
          headers: {
            Authorization: `Bearer ${token}`, // Sử dụng token đã lấy
          },
        }
      );

      setServices(response.data.services || []);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm dịch vụ", error);
    }
  };

  useEffect(() => {
    if (searchTerm || priceRange) {
      searchServices(searchTerm, priceRange);
    } else {
      fetchServices();
    }
  }, [searchTerm, priceRange]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    fetchServices(1, pagination.limit);
  };

  const handlePageChange = (event, value) => {
    fetchServices(value, pagination.limit);
  };

  const handleAddSubmit = async (newService) => {
    if (!checkData(selectedService)) return;
    const payload = { ...newService };
    const encodedData = btoa(encodeURIComponent(JSON.stringify(payload)));
    try {
      const response = await axios.post(
        `${url}apihm/Admin/Service/add_service.php`,
        {
          data: encodedData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sử dụng token đã lấy
          },
        }
      );

      if (response.data.error && response.data.error.code === 0) {
        setMessage("Thêm dịch vụ thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }

      setOpenAdd(false);
      fetchServices();
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
    }
  };

  const handleEditSubmit = async () => {
    if (!checkData(selectedService)) return;
    const payload = { ...selectedService };
    const encodedData = btoa(encodeURIComponent(JSON.stringify(payload)));
    try {
      const response = await axios.post(
        `${url}apihm/Admin/Service/edit_service.php`,
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
        setMessage("Sửa dịch vụ thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
      setOpenEdit(false);
      fetchServices();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) return;

    try {
      const response = await axios.delete(
        `${url}apihm/Admin/Service/delete_service.php`,
        {
          data: { service_id: id },
          headers: {
            Authorization: `Bearer ${token}`, // Sử dụng token đã lấy
          },
        }
      );
      if (response.data.success) {
        setMessage("Xóa dịch vụ thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
      setServices(services.filter((service) => service.service_id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };
  const handleAddClick = () => setOpenAdd(true);
  const handleAddClose = () => setOpenAdd(false);

  const handleEdit = (service) => {
    setSelectedService(service);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    resetSelectedService();
  };

  const formatPrice = (giatri) => {
    return giatri
      ? giatri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫"
      : "0 ₫";
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return {
    services,
    pagination,
    openEdit,
    openAdd,
    searchTerm,
    selectedService,
    priceRange,
    openSnackbar,
    message,
    expandedRows,
    fetchServices,
    setOpenSnackbar,
    setMessage,
    handleSearch,
    setSelectedService,
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
    resetSelectedService,
  };
};
export default ServiceController;
