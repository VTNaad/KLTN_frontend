import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FlightSearch = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [minTax, setMinTax] = useState("");
  const [maxTax, setMaxTax] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await fetch(`${apiUrl}/flights/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departure,
          destination,
          minTax,
          maxTax,
        }),
      });

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        navigate("/resultFlight", { state: { filters: { departure, destination, minTax, maxTax } } });

      } else {
        console.error("Không tìm thấy chuyến bay phù hợp", data);
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm chuyến bay:", error);
    }
  };

  return (
    <div className="search-content">
      <input
        type="text"
        placeholder="Điểm đi"
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
      />
      <input
        type="text"
        placeholder="Điểm đến"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <input
        type="number"
        placeholder="Giá tối thiểu"
        value={minTax}
        onChange={(e) => setMinTax(e.target.value)}
      />
      <input
        type="number"
        placeholder="Giá tối đa"
        value={maxTax}
        onChange={(e) => setMaxTax(e.target.value)}
      />
      <button onClick={handleSearch}>🔍</button>
    </div>
  );
};

export default FlightSearch;
