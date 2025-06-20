import React, { useState, useEffect } from "react";

const FlightList1 = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://your-api.com/flights") // Thay URL API thực tế
      .then((response) => response.json())
      .then((data) => {
        setFlights(data);
        setLoading(false);
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu chuyến bay:", error));
  }, []);

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
        Chuyến bay giá tốt từ <span style={{ color: "red" }}>Hồ Chí Minh</span>
      </h2>
      <p>Những chuyến bay giá tốt nhất trong tháng khởi hành từ Hồ Chí Minh</p>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {flights.map((flight) => (
            <div key={flight.id} style={{ 
              width: "250px", padding: "15px", borderRadius: "10px", 
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)", background: "#fff" 
            }}>
              <p style={{ fontWeight: "bold" }}>{flight.airline}</p>
              <p>{flight.departure} → {flight.destination}</p>
              <p>✈ Khởi hành: {flight.departureDate}</p>
              <p style={{ fontSize: "18px", fontWeight: "bold", color: "red" }}>
                {flight.price} ₫
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightList1;
