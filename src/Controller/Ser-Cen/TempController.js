import { useState, useEffect } from "react";
import axios from "axios";
import ApiService from "../../services/ApiCaller";

const TempController = (url) => {
  const [selectedServiceCen, setSelectedServiceCen] = useState({
    service_id: "",
    gara_id: "",
  });
  const [serviceCen, setserviceCen] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [centers, setCenters] = useState([]);
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchServiceCen();
    fetchServices();
    fetchCenters();

    if (selectedServiceCen?.gara_id) {
      fetchServices(selectedServiceCen.gara_id);
    }
  }, [selectedServiceCen?.gara_id]);

  const fetchCenters = async () => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Central_service/get_center.php`
      );
      setCenters(response.data);
    } catch (error) {
      console.error("Lỗi khi load trung tâm", error);
    }
  };

  const fetchServices = async (Id) => {
    if (!Id) {
      console.log("Id không hợp lệ:", Id);
      return;
    }
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Central_service/get_service_by_center.php`,
        {
          params: { gara_id: Id },
        }
      );
      console.log("Dữ liệu dịch vụ từ API:", response.data); // Kiểm tra dữ liệu
      setServices(response.data);
    } catch (error) {
      console.error("Lỗi khi load dịch vụ:", error);
    }
  };
  const fetchServiceCen = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Central_service/get_central_service.php`,
        {
          params: { page, limit },
        }
      );
      const data = response.data;
      if (data && Array.isArray(data.data)) {
        setserviceCen(data.data);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          limit,
        });
      } else {
        setserviceCen([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dịch vụ:", error);
    }
  };

  const checkData = (newSercen) => {
    if (!newSercen.gara_id || !newSercen.service_id) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return false;
    }
    return true;
  };
  const resetSelectedSerCen = () =>
    setSelectedServiceCen({
      gara_id: 0,
      service_id: 0,
    });

  // const searchServices = async (service_name, priceRange) => {
  //   try {
  //     const [minPrice, maxPrice] = priceRange;
  //     const response = await axios.get(
  //       `${url}apihm/Admin/Service/search_service.php`,
  //       {
  //         params: { service_name, minPrice, maxPrice },
  //       }
  //     );

  //     setServices(response.data.services || []);
  //   } catch (error) {
  //     console.error("Lỗi khi tìm kiếm dịch vụ", error);
  //   }
  // };

  const handlePageChange = (event, value) => {
    fetchServiceCen(value, pagination.limit);
  };

  const handleAddSubmit = async (newSercen) => {
    if (!checkData(selectedServiceCen)) return;
    const payload = { ...newSercen };
    const encodedData = btoa(encodeURIComponent(JSON.stringify(payload)));
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Central_service/add_central_service.php`,
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
      fetchServiceCen();
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
    }
  };

  // const handleEditSubmit = async () => {
  //   if (!checkData(selectedServiceCen)) return;
  //   try {
  //     const response = await axios.post(
  //       `${url}apihm/Admin/Central_service/edit_central_service.php`,
  //       selectedServiceCen
  //     );
  //     if (response.data.success) {
  //       setMessage("Sửa dịch vụ thành công!");
  //       setOpenSnackbar(true);
  //     } else {
  //       setMessage("Lỗi: " + response.data.message);
  //       setOpenSnackbar(true);
  //     }
  //     setOpenEdit(false);
  //     fetchServiceCen();
  //   } catch (error) {
  //     console.error("Lỗi khi cập nhật:", error);
  //   }
  // };

  const handleDelete = async (uid) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) return;
    try {
      const response = await ApiService.delete(
        `${url}apihm/Admin/Central_service/delete_central_service.php`,
        {
          data: { id: uid },
        }
      );
      if (response.data.success) {
        setMessage("Xóa dịch vụ thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
      setserviceCen(serviceCen.filter((ser) => ser.id !== uid));
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  const handleAddClick = () => setOpenAdd(true);
  const handleAddClose = () => {
    resetSelectedSerCen();
    setOpenAdd(false);
  };

  const handleEdit = (service) => {
    setSelectedServiceCen(service);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    resetSelectedSerCen();
  };

  return {
    services,
    centers,
    pagination,
    openEdit,
    openAdd,
    searchTerm,
    selectedService,
    selectedServiceCen,
    serviceCen,
    openSnackbar,
    message,
    handlePageChange,
    setOpenSnackbar,
    setMessage,
    setSelectedServiceCen,
    setSelectedService,
    handleAddSubmit,
    handleAddClick,
    handleAddClose,
    handleEdit,
    handleEditClose,
    handleDelete,
    setOpenEdit,
    setOpenAdd,
    setSearchTerm,
    resetSelectedSerCen,
  };
};
export default TempController;
