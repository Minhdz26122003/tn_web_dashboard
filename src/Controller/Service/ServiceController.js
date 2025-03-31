import { useState, useEffect } from "react";
import axios from "axios";
import ApiService from "../../services/ApiCaller";
import ServiceModel from "../../Model/Service/ServiceModel";
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
    limit: 4,
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [expandedRows, setExpandedRows] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Service/get_service.php`,
        {
          params: { page, limit },
        }
      );
      const data = response.data;
      if (data && Array.isArray(data.data)) {
        const service_data = data.data.map(
          (ser) => new ServiceModel({ ...ser })
        );
        setServices(service_data);
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
      const response = await ApiService.get(
        `${url}apihm/Admin/Service/search_service.php`,
        {
          params: { service_name, minPrice, maxPrice },
        }
      );
      const service_data = (response.data.services || []).map(
        (ser) => new ServiceModel({ ...ser })
      );
      setServices(service_data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm dịch vụ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm || priceRange) {
        await searchServices(searchTerm, priceRange);
      } else {
        await fetchServices();
      }
    };
    fetchData();
  }, [searchTerm, priceRange]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setServices([]);
    fetchServices(1, pagination.limit);
  };

  const handlePageChange = (event, value) => {
    fetchServices(value, pagination.limit);
  };

  const encodeBase64 = (obj) => {
    return btoa(encodeURIComponent(JSON.stringify(obj)));
  };

  const handleAddSubmit = async (newService) => {
    if (!checkData(selectedService)) return;
    const payload = { ...newService };
    const encodedData = encodeBase64(payload);
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Service/add_service.php`,
        {
          data: encodedData,
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
    const encodedData = encodeBase64(payload);
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Service/edit_service.php`,
        {
          data: encodedData,
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
      const response = await ApiService.delete(
        `${url}apihm/Admin/Service/delete_service.php`,
        {
          data: { service_id: id },
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
  const handleAddClick = () => {
    resetSelectedService();
    setOpenAdd(true);
  };
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
    if (!giatri) return "0";
    const numericValue =
      typeof giatri === "string"
        ? parseInt(giatri.replace(/\D/g, ""), 10)
        : giatri;
    return numericValue.toLocaleString("vi-VN");
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
