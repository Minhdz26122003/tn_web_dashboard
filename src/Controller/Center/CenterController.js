import { useState, useEffect } from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import ApiService from "../../services/ApiCaller";
import CenterModel from "../../Model/Center/CenterModel";
import { uploadImageToCloudinary } from "../../Utils/CloudiaryUp";
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
  // State để lưu trữ tệp ảnh mới được chọn
  const [selectedFile, setSelectedFile] = useState(null);
  // State để lưu trữ URL ảnh xem trước
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    fetchCenter(1, pagination.limit);
    if (selectedFile) {
      // tệp được chọn, tạo URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else if (selectedCenter && selectedCenter.gara_img) {
      // Nếu không có tệp mới nhưng có ảnh cũ, hiển thị ảnh cũ
      setImagePreviewUrl(selectedCenter.gara_img);
    } else {
      // Nếu không có cả ảnh mới và ảnh cũ
      setImagePreviewUrl(null);
    }
    return () => {
      // Cleanup
    };
  }, [selectedCenter, selectedFile]);

  const fetchCenter = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const response = await ApiService.get(
        `${url}apihm/Admin/Center/get_center.php`,
        {
          params: { page, limit },
        }
      );
      const data = response.data;
      if (data && Array.isArray(data.data)) {
        const center_data = data.data.map((cen) => new CenterModel({ ...cen }));
        setCenters(center_data);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          limit,
        });
      } else {
        setCenters([]);
        setPagination({ currentPage: 1, totalPages: 1, limit });
      }
    } catch (error) {
      console.error("Lỗi khi tải gara :", error);
    }
  };

  const checkData = (newCenter, selectedFile) => {
    const {
      gara_name,
      gara_address,
      phone,
      email,
      gara_img,
      x_location,
      y_location,
    } = newCenter;

    // 1. Kiểm tra các trường không được để trống
    if (
      !gara_name?.toString().trim() ||
      !gara_address?.toString().trim() ||
      !phone?.toString().trim() ||
      !phone?.toString().trim() ||
      !gara_img?.toString().trim() ||
      !x_location?.toString().trim() ||
      !y_location?.toString().trim()
    ) {
      setMessage("Vui lòng điền đầy đủ thông tin bắt buộc!");
      setOpenSnackbar(true);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Định dạng email không hợp lệ!");
      setOpenSnackbar(true);
      return false;
    }

    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      setMessage("Định dạng số điện thoại không hợp lệ!");
      setOpenSnackbar(true);
      return false;
    }

    if (!gara_img && !selectedFile) {
      setMessage("Vui lòng chọn ảnh gara!");
      setOpenSnackbar(true);
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
      const response = await ApiService.get(
        `${url}apihm/Admin/Center/search_center.php?${query}`
      );
      const center_data = (response.data.centers || []).map(
        (cen) => new CenterModel({ ...cen })
      );
      setCenters(center_data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm trung tâm:", error);
    }
  };

  useEffect(() => {
    const { gara_name, gara_address } = searchTerm;
    const delayDebounceFn = setTimeout(async () => {
      if (gara_name || gara_address) {
        await searchCenters(searchTerm);
      } else {
        await fetchCenter(1, pagination.limit);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pagination.limit]);

  const handleSearch = (key, value) => {
    setSearchTerm((prev) => ({ ...prev, [key]: value }));
    fetchCenter(1, pagination.limit);
  };

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({ ...prev, currentPage: value }));
    fetchCenter(value, pagination.limit);
  };

  const encodeBase64 = (obj) => {
    return btoa(encodeURIComponent(JSON.stringify(obj)));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      setSelectedCenter((prevCenter) => ({
        ...prevCenter,
        gara_img: file,
      }));
    } else {
      setSelectedFile(null);
      setImagePreviewUrl(null);
      setSelectedCenter((prevCenter) => ({
        ...prevCenter,
        gara_img: null,
      }));
    }
  };

  // add
  const handleAddSubmit = async (newCenter) => {
    if (!checkData(selectedCenter, selectedFile)) return;
    let imageUrl = "";
    if (selectedFile) {
      setMessage("Đang upload ảnh...");
      setOpenSnackbar(true);
      imageUrl = await uploadImageToCloudinary(selectedFile); // Gọi hàm upload
      if (!imageUrl) {
        // Nếu upload thất bại, hàm upload đã log lỗi
        setMessage("Thêm gara thất bại do lỗi upload ảnh.");
        setOpenSnackbar(true);
        return;
      }
      setMessage("Upload ảnh hoàn tất. Đang thêm dịch vụ..."); // Cập nhật trạng thái
      setOpenSnackbar(true);
    }
    const payload = {
      ...newCenter,
      gara_img: imageUrl || "",
    };

    const encodedData = encodeBase64(payload);
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Center/add_center.php`,
        {
          data: encodedData,
        }
      );

      if (response.data.error && response.data.error.code === 0) {
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
  //edit
  const handleEditSubmit = async () => {
    if (!checkData(selectedCenter, selectedFile)) return;
    let imageUrl = selectedCenter.gara_img;

    //Sử dụng hàm upload từ file dùng chung
    if (selectedFile) {
      setMessage("Đang upload ảnh mới...");
      setOpenSnackbar(true);
      imageUrl = await uploadImageToCloudinary(selectedFile);
      if (!imageUrl) {
        // Nếu upload thất bại, hàm upload đã log lỗi
        setMessage("Sửa gara thất bại do lỗi upload ảnh.");
        setOpenSnackbar(true);
        return;
      }
      setMessage("Upload ảnh mới hoàn tất. Đang cập nhật dịch vụ..."); // Cập nhật trạng thái
      setOpenSnackbar(true);
    }

    const payload = {
      ...selectedCenter,
      gara_img: imageUrl || "",
    };

    const encodedData = encodeBase64(payload);
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Center/edit_center.php`,
        {
          data: encodedData,
        }
      );
      if (response.data.success) {
        setMessage("Sửa tgara thành công!");
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

  //delete
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa trung tâm này không?"))
      return;

    try {
      const response = await ApiService.delete(
        `${url}apihm/Admin/Center/delete_center.php`,
        {
          data: { gara_id: id },
        }
      );
      if (response.data.success) {
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
    selectedFile,
    imagePreviewUrl,
    message,
    handleFileChange,
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
