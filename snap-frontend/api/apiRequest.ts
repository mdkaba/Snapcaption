import axios from "axios";

export const postImage = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await axios.post(
      "https://snapcaption-backend-336921101433.us-central1.run.app/upload_image",
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

export const generateCaption = async (imageURL: string) => {
  try {
    const response = await axios.get(
      "https://snapcaption-backend-336921101433.us-central1.run.app/get_caption",
      {
        params: { image_url: imageURL },
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // Return response data to handle it in the component
  } catch (error) {
    console.error("Failed to generate caption:", error);
    throw error; // Throw error to handle it in the component
  }
};

export const generateDescriptiveCaption = async (captions: string[]) => {
  try {
    const response = await axios.post(
      "https://snapcaption-backend-336921101433.us-central1.run.app/generate_caption",
      captions,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // Return response data to handle it in the component
  } catch (error) {
    console.error("Failed to generate caption:", error);
    throw error; // Throw error to handle it in the component
  }
};
