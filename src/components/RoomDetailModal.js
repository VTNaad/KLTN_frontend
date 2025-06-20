import React, { useState } from "react";
import "../css/RoomDetailModal.css";

const RoomDetailModal = ({ room, onClose }) => {
  const [imageIndex, setImageIndex] = useState(0);

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % room.images.length);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>✖</button>

        <div className="modal-left">
          <div className="image-slider">
            <button className="arrow left" onClick={prevImage}>❮</button>
            <img src={room.images[imageIndex]} alt="Room" />
            <button className="arrow right" onClick={nextImage}>❯</button>
          </div>
        </div>

        <div className="modal-right">
          <h2>{room.name}</h2>
          <ul className="detail-list">
            <li><b>Số khách:</b> {room.people} (Tối đa {room.maxPeople} khách, {room.standardPeople} tiêu chuẩn)</li>
            <li>{room.childrenPolicy}</li>
            <li><b>Diện tích:</b> {room.area}</li>
            <li><b>Hướng nhìn:</b> {room.view}</li>
            <li>✅ Hoàn huỷ một phần</li>
            <li>✅ Bao gồm bữa sáng</li>
          </ul>

          <h3>📌 Chính sách & Phụ thu</h3>
          <ul className="bullet-list">
            <li>Trẻ em trên 11 tuổi được tính như người lớn</li>
            <li>Miễn phí 1 trẻ dưới 12 tuổi</li>
            <li>Từ trẻ thứ 2 tính thêm 189.000đ</li>
            <li>Không đổi tên khách sau khi đặt</li>
          </ul>

          <h3>🛎 Tiện nghi phòng</h3>
          <ul className="amenities-grid">
            {room.amenities.map((item, index) => (
              <li key={index}> {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailModal;
