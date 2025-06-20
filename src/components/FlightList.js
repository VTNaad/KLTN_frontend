import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/FlightList.css";

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState("");
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleBookClick = (departure, destination) => {
  // Chuyển hướng sang /resultFlight và truyền điểm đi, điểm đến
    navigate("/resultFlight", {
      state: {
        filters: {
          departure,
          destination,
        },
      },
    });
  };

  useEffect(() => {
    fetch(`${apiUrl}/flights`)
      .then((res) => res.json())
      .then((data) => setFlights(data))
      .catch((err) => console.error("Lỗi khi lấy chuyến bay:", err));
  }, []);

  const filteredFlights = selectedDeparture
    ? flights.filter((flight) => flight.departure === selectedDeparture)
    : flights;

  const departures = [...new Set(flights.map((f) => f.departure))];
  const flightsToShow = showAll ? filteredFlights : filteredFlights.slice(0, 6);

  return (
    <div className="flight-container">
      <h2 className="flight-title">✈️ Tìm chuyến bay giá tốt</h2>

      <div className="flight-filter">
        <select
          value={selectedDeparture}
          onChange={(e) => setSelectedDeparture(e.target.value)}
        >
          <option value="">Tất cả điểm xuất phát</option>
          {departures.map((departure, index) => (
            <option key={index} value={departure}>
              {departure}
            </option>
          ))}
        </select>
        <button onClick={() => setSelectedDeparture("")}>Đặt lại</button>
      </div>

      <div className="flight-grid">
        {flightsToShow.length > 0 ? (
          flightsToShow.map((flight) => (
            <div key={flight._id} className="flight-card">
              {/* <img src={flight.image} alt={flight.airline} className="flight-img" /> */}
              <div className="flight-info">
                <h3>{flight.airline}</h3>
                <p className="flight-route">
                  {flight.departure} ➝ {flight.destination}
                </p>
                <p className="flight-date">
                  🕓 {new Date(flight.departureTime).toLocaleDateString()} -{" "}
                  {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="flight-price">
                  <span>Giá gốc: </span>
                  <strong>{flight.originalPrice.toLocaleString()} ₫</strong>
                </p>
                <p className="flight-price-final">
                  <span>Giá sau thuế: </span>
                  <strong>{flight.taxPrice.toLocaleString()} ₫</strong>
                </p>
                <button
                  className="flight-book"
                  onClick={() => handleBookClick(flight.departure, flight.destination)}
                >
                  Đặt vé ngay
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="flight-empty">Không có chuyến bay phù hợp.</p>
        )}
      </div>

      {filteredFlights.length > 6 && (
        <div className="flight-show-more">
          <button onClick={() => setShowAll(!showAll)}>
            {showAll ? "Ẩn bớt" : "Xem tất cả"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightList;
