import React, { useState } from "react";
import axios from "axios";

const ImageUploader = ({ setProfileImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const cloudinaryUploadPreset = "imageData"; 
  const cloudinaryCloudName = "dyricwenw"; 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", cloudinaryUploadPreset); 

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        formData
      );

      const imageUrl = response.data.secure_url; 
      setProfileImage(imageUrl); 
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Upload failed!");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" width="150" />}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ImageUploader;
