import axios from "axios";
const CLOUDINARY_CLOUD_NAME = "duemkqxyp";
const CLOUDINARY_UPLOAD_PRESET = "Appcar";

/**
 * Uploads a file to Cloudinary using an unsigned upload preset.
 * @param {File} file - The File object to upload.
 * @returns {Promise<string|null>} - A Promise that resolves with the secure URL of the uploaded image, or null if upload fails.
 */
export const uploadImageToCloudinary = async (file) => {
  if (!file) {
    console.error("Không có tệp nào được cung cấp để upload.");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    console.log("Upload Cloudinary thành công:", response.data);
    return response.data.secure_url; // Trả về URL ảnh trên Cloudinary
  } catch (error) {
    console.error(
      "Lỗi khi upload ảnh lên Cloudinary:",
      error.response?.data || error.message
    );

    return null;
  }
};
