import React, { useState, useEffect } from "react";
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
        const users = data.data.map((acc) => new AccountModel({ ...acc }));
        setAccounts(users);
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

      const users = (response.data.accounts || []).map(
        (acc) => new AccountModel({ ...acc })
      );
      setAccounts(users);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm tài khoản:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm) {
        await searchAccounts(searchTerm);
      } else {
        await fetchAccounts(1, pagination.limit);
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(acc.email)) {
      setMessage("Định dạng email không hợp lệ!");
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };
  const encodeBase64 = (obj) => {
    return btoa(encodeURIComponent(JSON.stringify(obj)));
  };
  const handleAddSubmit = async (newAccount) => {
    // if (!checkData(selectedAccount)) return;
    const payload = { ...newAccount };
    const encodedData = encodeBase64(payload);
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
        setMessage("Lỗi: " + response.data.error.message);
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
    const encodedData = encodeBase64(payload);
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

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?"))
  //     return;

  //   try {
  //     const response = await ApiService.delete(
  //       `${url}myapi/Taikhoan/xoataikhoan`,
  //       {
  //         params: { iduser: id },
  //       }
  //     );
  //     if (response.data.success) {
  //       setMessage("Xóa tài khoản thành công!");
  //       setOpenSnackbar(true);
  //     } else {
  //       setMessage("Lỗi: " + response.data.message);
  //       setOpenSnackbar(true);
  //     }
  //     setAccounts(accounts.filter((account) => account.iduser !== id));
  //   } catch (error) {
  //     console.error("Xóa tài khoản không thành công:", error);
  //   }
  // };
  const handleLock = async (uid) => {
    if (!window.confirm("Bạn có chắc chắn muốn khóa tài khoản này không?"))
      return;

    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Account/lock_acc.php`,
        {
          uid,
        }
      );
      if (response.data.success) {
        setMessage("Khóa tài khoản thành công!");
        setOpenSnackbar(true);
        fetchAccounts();
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Khóa tài khoản không thành công:", error);
    }
  };

  const handleUnLock = async (uid) => {
    if (!window.confirm("Bạn có chắc chắn muốn mở khóa tài khoản này không?"))
      return;

    try {
      const response = await ApiService.post(
        `${url}apihm/Admin/Account/unlock_acc.php`,
        {
          uid,
        }
      );
      if (response.data.success) {
        setMessage("Mở khóa tài khoản thành công!");
        setOpenSnackbar(true);
        fetchAccounts();
      } else {
        setMessage("Lỗi: " + response.data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("mở khóa tài khoản không thành công:", error);
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

  const handleAddClick = () => {
    resetSelectedAccount();
    setOpenAdd(true);
  };
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
    handleLock,
    openSnackbar,
    filteredStatus,
    handleUnLock,
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
    //handleDelete,
    handleEdit,
    handleEditClose,
    handleAddClick,
    handleAddClose,
    resetSelectedAccount,
  };
};

export default AccountController;
