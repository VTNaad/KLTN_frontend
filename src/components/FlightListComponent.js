import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/FlightListComponent.css";

const FlightListComponent = ({ flights }) => {
  const navigate = useNavigate();

  if (!flights || flights.length === 0) {
    return <p>Không có chuyến bay phù hợp.</p>;
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="flight-list">
      {flights.map((flight, index) => {
        const finalPrice = (flight.originalPrice || 0) + (flight.taxPrice || 0);

        return (
          <div key={flight._id || index} className="flight-item">
            <img
              src={flight.image}
              alt={flight.airline}
              className="flight-logo"
            />
            <div className="flight-info">
              <h4 className="flight-route">
                ✈ {flight.departure} → {flight.destination}
              </h4>
              <p className="flight-airline">{flight.airline} - {flight.flightNumber}</p>
              <p className="flight-time">🕐 Cất cánh: {formatTime(flight.departureTime)}</p>
              <p className="flight-time">🛬 Hạ cánh: {formatTime(flight.arrivalTime)}</p>
              <p className="flight-seats">👥 Ghế còn: {flight.seatsAvailable}</p>
              <div className="flight-price">
                <span className="price-label">Giá vé:</span>
                <strong className="final-price">
                  {finalPrice.toLocaleString("vi-VN")}₫
                </strong>
                {flight.originalPrice && (
                  <span className="original-price">
                    (Giá gốc: {flight.originalPrice.toLocaleString("vi-VN")}₫)
                  </span>
                )}
              </div>
            </div>
            <button
              className="book-button"
              onClick={() => navigate(`/checkout-flight/${flight._id}`)}
            >
              Đặt vé
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default FlightListComponent;
