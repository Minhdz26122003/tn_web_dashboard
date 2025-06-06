import { useState, useEffect } from "react";
import axios from "axios";
import ApiService from "../../services/ApiCaller";
import AccountModel from "../../Model/Account/AcountModel";

const AccountController = (url) => {
  const [accounts, setAccounts] = useState([]);
  const [status, setStatus] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
    phonenum: "",
    avatar: "",
    address: "",
    birthday: "2000-01-01",
    gender: 0,
    status: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });

  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const roleMapping = {
    0: "Người dùng",
    1: "Quản lý",
    2: "Nhân viên",
    3: "Bị khóa",
  };
  const genderMapping = { 0: "Nam", 1: "Nữ", 2: "Khác" };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredStatus = accounts.filter((account) => {
    if (status === null) return true;
    return Number(account.status) === Number(status);
  });

  const fetchAccounts = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const uid = localStorage.getItem("uid");
      if (!uid) {
        console.error("Không tìm thấy uid trong localStorage.");
        return;
      }
      const response = await ApiService.get(
        `${url}apihm/Admin/Account/get_acc.php`,
        {
          params: { uid, page, limit },
        }
      );

      const data = response.data;
      if (data && Array.isArray(data.data)) {
        setAccounts(data.data);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          limit,
        });
      } else {
        setAccounts([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải tài khoản:", error);
    }
  };

  const searchAccounts = async (username) => {
    try {
      const uid = localStorage.getItem("uid");
      const response = await ApiService.get(
        `${url}apihm/Admin/Account/search_acc.php`,
        {
          params: { uid, username },
        }
      );

      setAccounts(response.data.accounts || []);
    } catch (error) {
      console.error("Error searching accounts:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm) {
        await searchAccounts(searchTerm);
      } else {
        await fetchAccounts();
      }
    };
    fetchData();
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    fetchAccounts(value, pagination.limit);
  };

  const checkData = (acc) => {
    if (
      !acc.username ||
      !acc.email ||
      !acc.fullname ||
      !acc.phonenum ||
      !acc.address ||
      acc.gender === undefined ||
      acc.status === undefined
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return false;
    }
    return true;
  };

  const handleAddSubmit = async (newAccount) => {
    // if (!checkData(selectedAccount)) return;
    const payload = { ...newAccount };
    const encodedData = btoa(encodeURIComponent(JSON.stringify(payload)));
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Account/add_acc.php`,
        {
          data: encodedData,
        }
      );
      if (response.data.error && response.data.error.code === 0) {
        setMessage("Thêm tài khoản thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
      setOpenAdd(false);
      fetchAccounts();
    } catch (error) {
      console.error("Thêm tài khoản không thành công", error);
    }
  };

  const handleEditSubmit = async () => {
    // if (!checkData(selectedAccount)) return;
    const payload = { ...selectedAccount };
    const encodedData = btoa(encodeURIComponent(JSON.stringify(payload)));
    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Account/edit_acc.php`,
        { data: encodedData }
      );
      if (response.data.success) {
        setMessage("Sửa tài khoản thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
      setOpenEdit(false);
      fetchAccounts();
    } catch (error) {
      console.error("Sửa tài khoản không thành công", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?"))
      return;

    try {
      const response = await ApiService.delete(
        `${url}myapi/Taikhoan/xoataikhoan`,
        {
          params: { iduser: id },
        }
      );
      if (response.data.success) {
        setMessage("Xóa tài khoản thành công!");
        setOpenSnackbar(true);
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
      setAccounts(accounts.filter((account) => account.iduser !== id));
    } catch (error) {
      console.error("Xóa tài khoản không thành công:", error);
    }
  };
  const handleDetail = (account) => {
    setSelectedAccount(account);
    setOpenDetail(true);
  };

  const handleDetailClose = () => {
    setOpenDetail(false);
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setOpenEdit(true);
  };

  const resetSelectedAccount = () =>
    setSelectedAccount({
      username: "",
      email: "",
      password: "",
      fullname: "",
      phonenum: "",
      avatar: "",
      address: "",
      birthday: "2000-01-01",
      gender: 0,
      status: 0,
    });

  const handleEditClose = () => {
    setOpenEdit(false);
    resetSelectedAccount();
  };

  const handleAddClick = () => setOpenAdd(true);
  const handleAddClose = () => setOpenAdd(false);

  return {
    status,
    pagination,
    openEdit,
    openAdd,
    openDetail,
    searchTerm,
    accounts,
    selectedAccount,
    roleMapping,
    genderMapping,
    message,
    setOpenSnackbar,
    openSnackbar,
    filteredStatus,
    fetchAccounts,
    handleDetailClose,
    handleDetail,
    setMessage,
    setStatus,
    setSelectedAccount,
    handleSearch,
    handlePageChange,
    handleAddSubmit,
    handleEditSubmit,
    handleDelete,
    handleEdit,
    handleEditClose,
    handleAddClick,
    handleAddClose,
    resetSelectedAccount,
  };
};

export default AccountController;
