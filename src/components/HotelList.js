import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import {
  FaWifi,
  FaTv,
  FaSwimmingPool,
  FaUtensils,
  FaCar,
  FaDumbbell,
  FaSpa,
  FaHeart
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const provinces = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Huế", "Nha Trang"];
const apiUrl = process.env.REACT_APP_API_URL;

const amenityIcons = {
  Wifi: <FaWifi />,
  TV: <FaTv />,
  "Hồ bơi": <FaSwimmingPool />,
  "Nhà hàng": <FaUtensils />,
  "Chỗ đỗ xe": <FaCar />,
  "Phòng gym": <FaDumbbell />,
  Spa: <FaSpa />
};

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [favoriteHotelIds, setFavoriteHotelIds] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const fetchHotels = async (province) => {
    try {
      setLoading(true);
      const endpoint = province
        ? `${apiUrl}/hotels/province/${encodeURIComponent(province)}`
        : `${apiUrl}/hotels`;
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        setHotels(data.data);
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${apiUrl}/favorites/${userId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.favoriteHotels)) {
        setFavoriteHotelIds(data.favoriteHotels.map((hotel) => hotel._id));
      } else {
        setFavoriteHotelIds([]);
        console.warn("API favorites trả về không đúng định dạng:", data);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  const toggleFavorite = async (hotelId) => {
    if (!userId) return alert("Vui lòng đăng nhập để sử dụng chức năng yêu thích.");
    const isFavorite = favoriteHotelIds.includes(hotelId);

    try {
      const endpoint = `${apiUrl}/favorites`;
      const method = isFavorite ? "DELETE" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, hotelId })
      });

      const data = await res.json();
      if (data.success) {
        setFavoriteHotelIds((prev) =>
          isFavorite ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]
        );
      } else {
        console.error("Lỗi cập nhật yêu thích:", data.message);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  useEffect(() => {
    fetchHotels(selectedProvince);
    setShowAll(false);
  }, [selectedProvince]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const displayedHotels = showAll ? hotels : hotels.slice(0, 8);

  return (
    <div
      style={{
        padding: "30px",
        background: "#f7f9fc",
        minHeight: "100vh",
        maxWidth: "1300px",
        margin: "0 auto"
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Khách sạn nổi bật</h2>

      {/* Bộ lọc tỉnh */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap"
        }}
      >
        <button
          onClick={() => setSelectedProvince("")}
          style={{
            padding: "10px 20px",
            background: selectedProvince === "" ? "#007BFF" : "#ddd",
            color: selectedProvince === "" ? "white" : "black",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Tất cả
        </button>
        {provinces.map((province) => (
          <button
            key={province}
            onClick={() => setSelectedProvince(province)}
            style={{
              padding: "10px 20px",
              background: selectedProvince === province ? "#007BFF" : "#ddd",
              color: selectedProvince === province ? "white" : "black",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer"
            }}
          >
            {province}
          </button>
        ))}
      </div>

      {/* Danh sách khách sạn */}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "25px",
              marginLeft: "25px"
            }}
          >
            {displayedHotels.length > 0 ? (
              displayedHotels.map((hotel, index) => {
                const isFavorite = favoriteHotelIds.includes(hotel._id);
                return (
                  <div
                    key={hotel._id}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      width: "280px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: hoveredIndex === index
                        ? "0 8px 20px rgba(0,0,0,0.15)"
                        : "0 5px 15px rgba(0,0,0,0.1)",
                      background: "white",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      transform: hoveredIndex === index ? "translateY(-5px)" : "translateY(0)",
                      position: "relative",
                      cursor: "pointer"
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 2
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(hotel._id);
                      }}
                    >
                      <FaHeart
                        size={20}
                        color={isFavorite ? "#e74c3c" : "#ccc"}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <img
                      src={
                        hotel.images[0] ||
                        "https://via.placeholder.com/280x180?text=No+Image"
                      }
                      alt={hotel.name}
                      onClick={() => navigate(`/hotelInfo?id=${hotel._id}`)}
                      style={{ width: "100%", height: "180px", objectFit: "cover" }}
                    />
                    <div style={{ padding: "15px" }}>
                      <h3
                        style={{
                          margin: "5px 0",
                          fontSize: "18px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                        title={hotel.name}
                      >
                        {hotel.name}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px"
                        }}
                      >
                        <span style={{ fontSize: "14px", color: "#666" }}>
                          {hotel.province}
                        </span>
                        <span style={{ fontSize: "14px", color: "#f39c12" }}>
                          ⭐ {hotel.starRating || "?"}
                        </span>
                      </div>

                      {/* Tiện nghi */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          marginBottom: "10px"
                        }}
                      >
                        {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            title={amenity}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "13px",
                              background: "#f0f0f0",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              gap: "4px"
                            }}
                          >
                            {amenityIcons[amenity]} {amenity}
                          </span>
                        ))}
                      </div>

                      <p style={{ fontSize: "16px", margin: "5px 0" }}>
                        <b style={{ color: "#e74c3c" }}>
                          {hotel.pricePerNight.toLocaleString()} đ
                        </b>
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Không có khách sạn nào phù hợp.</p>
            )}
          </div>

          {/* Nút xem thêm */}
          {hotels.length > 8 && (
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button
                onClick={() => setShowAll(!showAll)}
                style={{
                  padding: "12px 30px",
                  background: "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "background 0.3s"
                }}
              >
                {showAll ? "Thu gọn" : "Xem tất cả"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HotelList;
