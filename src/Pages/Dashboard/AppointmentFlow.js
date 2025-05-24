import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const FlowNode = ({ label }) => (
  <Box
    sx={{
      width: 120, // Chiều rộng của node
      height: 120, // Chiều cao của node
      borderRadius: "70px", // Bo tròn để tạo hình elip
      background: "linear-gradient(to bottom, #50a047, #3b873e)",
      display: "flex",
      padding: 2,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
      "@media (max-width: 600px)": {
        width: 100,
        height: 100,
        borderRadius: "50px",
        fontSize: 12,
      },
    }}
  >
    <Typography
      sx={{
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
      }}
    >
      {label}
    </Typography>
  </Box>
);

// Mũi tên dạng khối với đầu tam giác không có isLastStep)
const CustomArrow = ({ label, color = "#ff9800", textColor = "#000" }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      mx: 0, // Khoảng cách giữa các node và mũi tên
      position: "relative", // Để định vị nhãn
      height: 15, // chiều cao của mũi tên
    }}
  >
    {/* Phần thân hình chữ nhật của mũi tên */}
    <Box
      sx={{
        width: 130, // Chiều rộng của phần thân chữ nhật
        height: "100%", // Chiều cao bằng với parent (40px)
        bgcolor: color,
        borderRadius: "4px 0 0 4px", // Bo tròn góc trái
        flexShrink: 0, // Ngăn co lại
      }}
    />
    {/* Phần đầu tam giác của mũi tên */}
    <Box
      sx={{
        width: 0,
        height: 40, // Chiều cao của mũi tên
        borderTop: `20px solid transparent`, // Nửa chiều cao của mũi tên
        borderBottom: `20px solid transparent`, // Nửa chiều cao của mũi tên
        borderLeft: `15px solid ${color}`, // Tạo hình tam giác hướng sang phải với màu tương ứng
        flexShrink: 0,
        marginLeft: "-2px", // Dịch sang trái một chút để nối liền với thân chữ nhật
      }}
    />
    {/* Nhãn của mũi tên */}
    <Typography
      sx={{
        position: "absolute",
        top: -25, // Đặt nhãn phía trên mũi tên
        left: "45%",
        transform: "translateX(-50%)",
        fontSize: 15, // Kích thước chữ
        fontWeight: "bold",
        color: textColor,
        whiteSpace: "nowrap",
        bgcolor: "rgba(255, 255, 255, 0.8)", // Nền trắng nhẹ cho nhãn
        px: 0.5,
        borderRadius: "3px",
      }}
    >
      {label}
    </Typography>
  </Box>
);

// Component container để quản lý luồng
const FlowContainer = ({ title, steps, statusCounts }) => {
  const getArrowLabel = (stepLabel, currentCounts) => {
    switch (stepLabel) {
      case "CHỜ XÁC NHẬN":
        return currentCounts?.chua_xac_nhan
          ? `${currentCounts.chua_xac_nhan} đợi duyệt`
          : "";
      case "ĐANG SỬA":
        return currentCounts?.dang_sua
          ? `${currentCounts.dang_sua} đang sửa`
          : "";
      // case "HOÀN THÀNH":
      //   return currentCounts?.hoan_thanh
      //     ? `${currentCounts.hoan_thanh} sửa xong`
      //     : "";
      case "QUYẾT TOÁN":
        return currentCounts?.quyet_toan
          ? `${currentCounts.quyet_toan} đang quyểt toán`
          : "";
      case "ĐÃ THANH TOÁN":
        return currentCounts?.da_thanh_toan
          ? `${currentCounts.da_thanh_toan} đã thanh toán`
          : "0 phiếu đã thanh toán";
      default:
        return "";
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: "20px 20px 30px 30px",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        bgcolor: "#ffffff",
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: "#333" }}>
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <FlowNode label={step.label} />
            {/* Chỉ hiển thị mũi tên nếu không phải là node cuối cùng */}
            {index < steps.length - 1 && (
              <CustomArrow
                label={getArrowLabel(step.label, statusCounts)}
                color={step.arrow?.color} // Sử dụng optional chaining
                textColor={step.arrow?.textColor}
              />
            )}
            {/* Nếu là node cuối cùng, thêm mũi tên và sau đó là dấu tích xanh */}
            {index === steps.length - 1 && (
              <>
                <CustomArrow
                  label={getArrowLabel(step.label, statusCounts)}
                  color={step.arrow?.color}
                  textColor={step.arrow?.textColor}
                />
                {/* Dấu tích xanh sau mũi tên cuối cùng */}
                <CheckCircleIcon
                  sx={{ color: "#4CAF50", fontSize: 40, mx: 2 }}
                />
              </>
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

// Component chính để hiển thị luồng xử lý lịch hẹn
const AppointmentFlow = ({ statusCounts }) => {
  const appointmentFlowSteps = [
    {
      label: "CHỜ XÁC NHẬN",
      arrow: {
        color: "#ff9800",
        textColor: "#ff9800",
      },
    },
    {
      label: "ĐANG SỬA",
      arrow: {
        color: "#f44336",
        textColor: "#f44336",
      },
    },
    // {
    //   label: "HOÀN THÀNH",
    //   arrow: {
    //     color: "#f44336",
    //     textColor: "#f44336",
    //   },
    // },
    {
      label: "QUYẾT TOÁN",
      arrow: {
        color: "#f44336",
        textColor: "#f44336",
      },
    },
    {
      label: "ĐÃ THANH TOÁN",
      arrow: {
        color: "#50a047",
        textColor: "#50a047",
      },
    },
  ];

  return (
    <Box
      sx={{
        p: 0.5,
        bgcolor: "#f0f2f5",
        minHeight: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <FlowContainer
        title="Luồng xử lý lịch hẹn:"
        steps={appointmentFlowSteps}
        statusCounts={statusCounts}
      />
    </Box>
  );
};

export default AppointmentFlow;
