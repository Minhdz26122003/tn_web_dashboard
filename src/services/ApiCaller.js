import axios from "axios";
import url from "../Global/ipconfixad";
const ApiCaller = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động thêm token vào headers mỗi lần request
ApiCaller.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default ApiCaller;
