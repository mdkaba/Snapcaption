import axios from "axios";

export const postImage = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/upload_image",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data; // Return response data to handle it in the component
  } catch (error) {
    console.error("Upload failed (to endpoint):", error);
    throw error; // Throw error to handle it in the component
  }
};
