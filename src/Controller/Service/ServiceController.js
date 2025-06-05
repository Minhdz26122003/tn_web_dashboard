import { useState, useEffect } from "react";
import axios from "axios";
import ApiService from "../../services/ApiCaller";
import ServiceModel from "../../Model/Service/ServiceModel";
import { uploadImageToCloudinary } from "../../Utils/CloudiaryUp";

const ServiceController = (url) => {
  const [services, setServices] = useState([]);
  const [types, setTypes] = useState([]);
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
    limit: 10,
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [expandedRows, setExpandedRows] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  // State để lưu trữ tệp ảnh mới được chọn
  const [selectedFile, setSelectedFile] = useState(null);
  // State để lưu trữ URL ảnh xem trước
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    fetchServices(1, pagination.limit);
    fetchTypeServices();
    if (selectedFile) {
      // tệp được chọn, tạo URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else if (selectedService && selectedService.service_img) {
      // Nếu không có tệp mới nhưng có ảnh cũ, hiển thị ảnh cũ
      setImagePreviewUrl(selectedService.service_img);
    } else {
      // Nếu không có cả ảnh mới và ảnh cũ
      setImagePreviewUrl(null);
    }
    return () => {};
  }, [selectedService, selectedFile]);

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

  const fetchTypeServices = async () => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/TypeService/get_type.php`
      );
      console.log("Dữ liệu loại dịch vụ từ API:", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setTypes(response.data.data);
      } else {
        setTypes([]);
      }
    } catch (error) {
      console.error("Lỗi khi load loại dịch vụ:", error);
      setTypes([]); // Đảm bảo state là mảng rỗng khi có lỗi
    }
  };
  const checkData = (serviceData) => {
    if (
      !serviceData.service_name ||
      !serviceData.description ||
      serviceData.price === null ||
      serviceData.price === undefined ||
      serviceData.price === "" || // Kiểm tra thêm cho trường hợp rỗng
      !serviceData.time
    ) {
      setMessage("Vui lòng điền đầy đủ thông tin bắt buộc!");
      setOpenSnackbar(true);
      return false;
    }
    const numericPrice = parseInt(
      serviceData.price.toString().replace(/\D/g, ""),
      10
    );

    if (isNaN(numericPrice) || numericPrice < 0) {
      setMessage("Giá tiền không hợp lệ!");
      setOpenSnackbar(true);
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
        await fetchServices(1, pagination.limit);
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

  //Hàm xử lý chọn tệp ảnh
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      if (selectedService && selectedService.service_img) {
        setImagePreviewUrl(selectedService.service_img);
      } else {
        setImagePreviewUrl(null);
      }
    }
  };

  const handleAddSubmit = async (newService) => {
    if (!checkData(selectedService)) return;

    let imageUrl = "";
    if (selectedFile) {
      setMessage("Đang upload ảnh...");
      setOpenSnackbar(true);
      imageUrl = await uploadImageToCloudinary(selectedFile); // Gọi hàm upload
      if (!imageUrl) {
        setMessage("Thêm dịch vụ thất bại do lỗi upload ảnh.");
        setOpenSnackbar(true);
        return;
      }
      setMessage("Upload ảnh hoàn tất. Đang thêm dịch vụ..."); // Cập nhật trạng thái
      setOpenSnackbar(true);
    }
    const payload = {
      ...newService,
      service_img: imageUrl || "",
    };

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
      fetchServices(1, pagination.limit);
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
    }
  };

  const handleEditSubmit = async () => {
    if (!checkData(selectedService)) return;
    let imageUrl = selectedService.service_img;

    //Sử dụng hàm upload từ file dùng chung
    if (selectedFile) {
      setMessage("Đang upload ảnh mới...");
      setOpenSnackbar(true);
      imageUrl = await uploadImageToCloudinary(selectedFile);
      if (!imageUrl) {
        // Nếu upload thất bại, hàm upload đã log lỗi
        setMessage("Sửa dịch vụ thất bại do lỗi upload ảnh.");
        setOpenSnackbar(true);
        return;
      }
      setMessage("Upload ảnh mới hoàn tất. Đang cập nhật dịch vụ..."); // Cập nhật trạng thái
      setOpenSnackbar(true);
    }

    const payload = {
      ...selectedService,
      service_img: imageUrl || "",
    };

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
      fetchServices(1, pagination.limit);
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
    setSelectedFile(null);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    resetSelectedService();
  };
  const formatPrice = (giatri) => {
    if (giatri === null || giatri === undefined || giatri === "") return "0"; // Xử lý trường hợp rỗng
    // Đảm bảo rằng giatri được xử lý như một chuỗi trước khi replace, và sau đó parse
    const numericValue = parseInt(String(giatri).replace(/\D/g, ""), 10);
    if (isNaN(numericValue)) return "0"; // Xử lý nếu không phải số hợp lệ sau khi làm sạch
    return numericValue.toLocaleString("vi-VN");
  };
  // const handlePriceChangeInField = (e) => {
  //   const value = e.target.value;
  //   setSelectedService({
  //     ...selectedService,
  //     price: value,
  //   });
  // };
  const handlePriceChangeInField = (e) => {
    const rawValue = e.target.value;
    // Loại bỏ tất cả các ký tự không phải là số từ giá trị nhập vào
    const numericString = rawValue.toString().replace(/\D/g, "");

    setSelectedService({
      ...selectedService,
      price: numericString, // Lưu giá trị đã được làm sạch
    });
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
    selectedFile,
    imagePreviewUrl,
    types,
    setTypes,
    handleFileChange,
    fetchServices,
    fetchTypeServices,
    handlePriceChangeInField,
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
