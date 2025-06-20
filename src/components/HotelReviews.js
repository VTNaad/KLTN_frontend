import React, { useState } from "react";
import HotelReviews2 from "./HotelReviews2"; // Đảm bảo tên file là HotelReviews2.jsx

const HotelReviews = ({ hotelId }) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className="hotel-reviews">
        <h3>Đánh giá của khách hàng</h3>
        <p>Khách sạn này có đánh giá rất tốt từ khách hàng.</p>

        <button className="detail-button" onClick={openModal}>
          Xem chi tiết
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <HotelReviews2 hotelId={hotelId} closeModal={closeModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default HotelReviews;
