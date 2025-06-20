import React from "react";
import {
  FaSwimmer,
  FaWifi,
  FaParking,
  FaUtensils,
  FaDumbbell,
  FaSpa,
  FaShuttleVan,
  FaDog,
  FaTv,
  FaFan,
  FaSmokingBan,
  FaConciergeBell,
  FaCocktail,
  FaBroom,
  FaLuggageCart,
  FaBuilding,
  FaServicestack,
} from "react-icons/fa";
import "../css/HotelAmenities.css";

const HotelAmenities = ({ amenities, openModal }) => {
  if (!amenities || amenities.length === 0) {
    return <p>Không có tiện nghi nào để hiển thị.</p>;
  }

  // Ánh xạ tiện nghi với biểu tượng
  const iconMap = {
    "Miễn phí bữa sáng": <FaUtensils />,
    "Đưa/đón khách sân bay": <FaShuttleVan />,
    "Hồ bơi ngoài trời": <FaSwimmer />,
    "Hồ bơi trong nhà": <FaSwimmer />,
    "Phòng tập gym": <FaDumbbell />,
    "Phòng xông hơi": <FaSpa />,
    "Phòng massage & spa": <FaSpa />,
    "Dịch vụ giặt là": <FaBroom />,
    "Lễ tân 24h": <FaConciergeBell />,
    "Internet miễn phí": <FaWifi />,
    "Bãi đỗ xe miễn phí": <FaParking />,
    "Điều hoà nhiệt độ": <FaFan />,
    "Không hút thuốc": <FaSmokingBan />,
    "Nhà hàng": <FaUtensils />,
    "Quầy bar": <FaCocktail />,
    "Dọn phòng hàng ngày": <FaBroom />,
    "Giữ hành lý": <FaLuggageCart />,
    "Thang máy": <FaBuilding />,
    "Được mang vật nuôi": <FaDog />,
    "Truyền hình cáp/vệ tinh": <FaTv />,
  };

  const topAmenities = amenities.slice(0, 3);

  return (
    <div className="hotel-amenities">
      <h3>Tiện nghi</h3>
      <ul>
        {topAmenities.map((amenity, index) => (
          <li key={index}>
            {iconMap[amenity] || <FaServicestack />} {amenity}
          </li>
        ))}
      </ul>
      <button
        className="detail-button"
        onClick={() =>
          openModal(
            <ul>
              {amenities.map((amenity, index) => (
                <li key={index}>
                  {iconMap[amenity] || <FaServicestack />} {amenity}
                </li>
              ))}
            </ul>
          )
        }
      >
        Xem tất cả tiện nghi
      </button>

      {/* <ul>
        <li>🕒 Lễ tân 24h</li>
        <li>🎒 Giữ hành lý</li>
        <li>📶 Internet miễn phí</li>
      </ul>
      <button className="detail-button" onClick={() => openModal("Chi tiết tiện nghi của khách sạn...")}>
        Xem chi tiết
      </button> */}
    </div>
  );
};

export default HotelAmenities;
