import { useState, useEffect } from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
const ProfileController = (user, url) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phonenum, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [fullname, setFullname] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [avatar, setAvatar] = useState("");

  // State dialog, snackbar
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openEdit, setOpenEdit] = useState(false);

  // State đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // State tài khoản được chọn để sửa
  const [selectedAccount, setSelectedAccount] = useState({
    username: "",
    email: "",
    phonenum: "",
    address: "",
    fullname: "",
    birthday: "2000-01-01",
    gender: 0,
    status: 0,
  });
  const roleMapping = {
    0: "Người dùng",
    1: "Quản lý",
    2: "Nhân viên",
    3: "Bị khóa",
  };
  const genderMapping = { 0: "Nam", 1: "Nữ", 2: "Khác" };
  const genderValue = Number(gender);

  useEffect(() => {
    if (user) {
      setUsername(user?.username || "");
      setEmail(user?.email || "");
      setPhone(user?.phonenum || "");
      setAddress(user?.address || "");
      setBirthday(user?.birthday || "");
      setFullname(user?.fullname || "");
      setGender(user?.gender || "");
      setStatus(user?.status || "");
    }
  }, [user]);

  // Xử lý mở/đóng Dialog Sửa
  const handleEdit = () => {
    setSelectedAccount({
      username,
      email,
      phonenum,
      address,
      fullname,
      birthday,
      gender,
      status,
    });
    setOpenEdit(true);
  };
  const handleEditClose = () => setOpenEdit(false);

  const handleEditSubmit = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const payload = {
        uid: user.uid,
        ...selectedAccount,
      };
      const encodedData = btoa(encodeURIComponent(JSON.stringify(payload)));
      const response = await axios.post(
        `${url}apihm/Admin/Profile/edit_profile.php`,
        { data: encodedData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (data?.success) {
        setSnackbarMessage("Sửa tài khoản thành công!");
      } else {
        setSnackbarMessage(data?.message || "Sửa tài khoản thất bại!");
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.log("lỗi ", error);
      setSnackbarMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      setSnackbarOpen(true);
    } finally {
      setOpenEdit(false);
    }
  };

  const resetpas = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  // Dialog đổi mật khẩu
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setError("");

    const payload = {
      uid: user.uid,
      currentPassword,
      newPassword,
    };
    const encodedData = btoa(encodeURIComponent(JSON.stringify(payload)));
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}apihm/Admin/Account/change_pass.php`,
        {
          data: encodedData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (data.success) {
        setSnackbarMessage("Đổi mật khẩu thành công!");
        resetpas();
      } else {
        setSnackbarMessage(data.message || "Đổi mật khẩu thất bại!");
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.log(error);
      setSnackbarMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      setSnackbarOpen(true);
    } finally {
      handleCloseDialog();
    }
  };

  return {
    username,
    email,
    phonenum,
    address,
    birthday,
    fullname,
    selectedAccount,
    genderMapping,
    genderValue,
    roleMapping,
    gender,
    status,
    avatar,
    isDialogOpen,
    snackbarOpen,
    snackbarMessage,
    openEdit,
    currentPassword,
    newPassword,
    confirmPassword,
    setSnackbarOpen,
    error,
    handleEdit,
    handleEditClose,
    handleEditSubmit,
    setSelectedAccount,
    handleOpenDialog,
    handleCloseDialog,
    handleChangePassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    genderValue: Number(gender),
  };
};
export default ProfileController;
