import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/new.scss";
import { DriveFolderUploadOutlined } from "@mui/icons-material";

const New = ({ inputs, title }) => {
  const [files, setFiles] = useState([]);
  const [hotels, setHotels] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const Id = queryParams.get("hotelId"); // Lấy hotelId từ URL
  const [formData, setFormData] = useState({
    hotelId: Id || "", // Gán giá trị hotelId vào formData nếu có
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const apiUrl = process.env.REACT_APP_API_URL;
  const { userId, hotelId, roomId, voucherId, airlineId, managerId } =
    useParams();

  const resourceType = userId
    ? "user"
    : hotelId
    ? "hotel"
    : roomId
    ? "room"
    : voucherId
    ? "voucher"
    : airlineId
    ? "flight"
    : managerId
    ? "manager"
    : "";

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${apiUrl}/hotels`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setHotels(data.data); // Lưu danh sách khách sạn
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, [apiUrl, token]);

  const handleHotelChange = (e) => {
    const selectedHotelId = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      hotelId: selectedHotelId, // Gán _id của khách sạn vào formData
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const processedFormData = { ...formData };

    if (
      processedFormData["policies.cancellationPolicy"] ||
      processedFormData["policies.paymentPolicy"]
    ) {
      processedFormData["policies"] = JSON.stringify({
        cancellationPolicy:
          processedFormData["policies.cancellationPolicy"] || "",
        paymentPolicy: processedFormData["policies.paymentPolicy"] || "",
      });
      delete processedFormData["policies.cancellationPolicy"];
      delete processedFormData["policies.paymentPolicy"];
    }

    if (
      processedFormData["contact.phone"] ||
      processedFormData["contact.email"]
    ) {
      processedFormData["contact"] = JSON.stringify({
        phone: processedFormData["contact.phone"] || "",
        email: processedFormData["contact.email"] || "",
      });
      delete processedFormData["contact.phone"];
      delete processedFormData["contact.email"];
    }

    if (
      processedFormData["location.lat"] ||
      processedFormData["location.lng"]
    ) {
      processedFormData["location"] = JSON.stringify({
        lat: Number(processedFormData["location.lat"]) || 0,
        lng: Number(processedFormData["location.lng"]) || 0,
      });
      delete processedFormData["location.lat"];
      delete processedFormData["location.lng"];
    }

    if (processedFormData["amenities"]) {
      processedFormData["amenities"] = processedFormData["amenities"]
        .split(",")
        .map((item) => item.trim());
    }

    if (resourceType === "room") {
      processedFormData["hotel"] = processedFormData["hotelId"];
    }
    const data = new FormData();

    // Add form data fields to FormData object
    Object.keys(processedFormData).forEach((key) => {
      data.append(key, processedFormData[key]);
    });

    // Add files to FormData
    if (files.length > 0) {
      if (resourceType === "user" || resourceType === "manager") {
        data.append("avatar", files[0]); // Chỉ 1 ảnh cho User
      } else if (resourceType === "voucher" || resourceType === "flight") {
        data.append("image", files[0]);
      } else {
        files.forEach((file) => data.append("images", file)); // Nhiều ảnh cho Hotel và Room
      }
    }

    try {
      let response;

      // Send request based on resourceType
      if (resourceType === "user") {
        response = await fetch(`${apiUrl}/user/createAccount`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        });
      } else if (resourceType === "manager") {
        response = await fetch(`${apiUrl}/user/createHotelManager`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        });
      } else if (resourceType === "hotel") {
        response = await fetch(`${apiUrl}/hotels/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        });
      } else if (resourceType === "room") {
        response = await fetch(`${apiUrl}/rooms/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        });
      } else if (resourceType === "voucher") {
        response = await fetch(`${apiUrl}/vouchers/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        });
      } else if (resourceType === "flight") {
        response = await fetch(`${apiUrl}/flights/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        });
      }

      const responseData = await response.json();

      if (response.ok) {
        alert("Resource created successfully!");
        if (resourceType === "flight") {
          navigate(`/admin/airlines`);
        } else if (resourceType === "manager") {
          navigate(`/admin/users`);
        } else {
          navigate(`/admin/${resourceType}s`);
        }
      } else {
        alert(responseData.message || "Failed to create resource");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during submission " + error.message);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            {(resourceType === "user" ||
              resourceType === "flight" ||
              resourceType === "voucher" ||
              resourceType === "manager") && (
              <img
                src={
                  files.length > 0
                    ? URL.createObjectURL(files[0])
                    : "/assets/person/DefaultProfile.jpg"
                }
                alt="user avatar"
                className="image"
              />
            )}

            {(resourceType === "hotel" || resourceType === "room") && (
              <div className="imagePreviewList">
                {files.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`preview ${index}`}
                    className="previewImage"
                    onClick={() => handleRemoveImage(index)}
                    title="Click to remove"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              {(resourceType === "hotel" || resourceType === "room") && (
                <div className="formInput">
                  <label htmlFor="files">
                    Images: <DriveFolderUploadOutlined className="icon" />
                  </label>
                  <input
                    type="file"
                    id="files"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleImagesChange}
                  />
                </div>
              )}
              {(resourceType === "user" ||
                resourceType === "flight" ||
                resourceType === "voucher" ||
                resourceType === "manager") && (
                <div className="formInput">
                  <label htmlFor="file">
                    Avatar: <DriveFolderUploadOutlined className="icon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                </div>
              )}

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    value={formData[input.name] || ""}
                    onChange={handleChange}
                  />
                </div>
              ))}

              {resourceType !== "hotel" &&
                resourceType !== "user" &&
                resourceType !== "flight" && (
                  // inputs.some((input) => input.name === "hotelId") &&
                  <div className="formInput">
                    <label>Hotel</label>
                    <select
                      name="hotelId"
                      value={formData.hotelId}
                      onChange={handleHotelChange}
                    >
                      <option value="">Select a hotel</option>
                      {hotels.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
