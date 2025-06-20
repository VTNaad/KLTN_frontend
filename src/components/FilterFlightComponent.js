import React, { useState } from "react";
import "../css/FilterComponent.css";

const FlightFilterComponent = ({ onFilterChange }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [airlines, setAirlines] = useState([]);
  const [departureTime, setDepartureTime] = useState("");

  const handleCheckboxChange = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const applyFilters = () => {
    onFilterChange({
      minPrice: minPrice !== "" ? minPrice : undefined,
      maxPrice: maxPrice !== "" ? maxPrice : undefined,
      airlines,
      departureTime,
    });
  };

  return (
    <div className="filter-container">
      <h3 className="filter-title">Bộ lọc chuyến bay</h3>

      {/* Giá vé */}
      <div className="filter-group">
        <label className="filter-label">Giá vé</label>
        <div className="price-inputs">
          <input
            type="number"
            className="filter-input"
            placeholder="Từ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
          />
          <input
            type="number"
            className="filter-input"
            placeholder="Đến"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
          />
        </div>
      </div>

      {/* Hãng bay */}
      <div className="filter-group">
        <label className="filter-label">Hãng hàng không</label>
        <div className="checkbox-group">
          {["Vietnam Airlines", "VietJet Air", "Bamboo Airways", "Pacific Airlines"].map((airline) => (
            <label key={airline} className="checkbox-label">
              <input
                type="checkbox"
                checked={airlines.includes(airline)}
                onChange={() => handleCheckboxChange(airline, airlines, setAirlines)}
              />
              {airline}
            </label>
          ))}
        </div>
      </div>

      {/* Giờ khởi hành */}
      <div className="filter-group">
        <label className="filter-label">Giờ khởi hành</label>
        <select
          className="filter-input"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
        >
          <option value="">Tất cả</option>
          <option value="morning">Sáng (05:00 - 11:00)</option>
          <option value="afternoon">Chiều (11:00 - 17:00)</option>
          <option value="evening">Tối (17:00 - 23:00)</option>
        </select>
      </div>

      <button className="apply-button" onClick={applyFilters}>Áp dụng</button>
    </div>
  );
};

export default FlightFilterComponent;
