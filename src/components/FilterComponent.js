import React, { useState } from "react";
import "../css/FilterComponent.css";

const FilterComponent = ({ onFilterChange }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [starRating, setStarRating] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [hasFreeCancellation, setHasFreeCancellation] = useState(false);

  const handleCheckboxChange = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const applyFilters = () => {
    onFilterChange({
      minPrice,
      maxPrice,
      starRating,
      amenities,
      province,
      district,
      freeCancellation: hasFreeCancellation,
    });
  };

  return (
    <div className="filter-container">
      <h3 className="filter-title">Bộ lọc tìm kiếm</h3>

      {/* Tỉnh, Quận */}
      <div className="filter-group">
        <input
          type="text"
          className="filter-input"
          placeholder="Tỉnh/Thành phố"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        />
        <input
          type="text"
          className="filter-input"
          placeholder="Quận/Huyện"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />
      </div>

      {/* Giá */}
      <div className="filter-group">
        <label className="filter-label">Giá mỗi đêm</label>
        <div className="price-inputs">
          <input
            type="number"
            className="filter-input"
            placeholder="Từ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            className="filter-input"
            placeholder="Đến"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Tiện nghi */}
      <div className="filter-group">
        <label className="filter-label">Tiện nghi</label>
        <div className="checkbox-group">
          {["Wifi", "Hồ bơi", "Bãi đậu xe", "Điều hòa", "Thang máy", "Nhà hàng"].map((item) => (
            <label key={item} className="checkbox-label">
              <input
                type="checkbox"
                checked={amenities.includes(item)}
                onChange={() => handleCheckboxChange(item, amenities, setAmenities)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* Hạng sao */}
      <div className="filter-group">
        <label className="filter-label">Hạng khách sạn</label>
        <div className="checkbox-group">
          {[5, 4, 3, 2, 1].map((star) => (
            <label key={star} className="checkbox-label">
              <input
                type="checkbox"
                checked={starRating.includes(star)}
                onChange={() => handleCheckboxChange(star, starRating, setStarRating)}
              />
              {"⭐".repeat(star)} ({star} sao)
            </label>
          ))}
        </div>
      </div>

      {/* Chính sách */}
      <div className="filter-group">
        <label className="filter-label">Chính sách</label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={hasFreeCancellation}
            onChange={() => setHasFreeCancellation(!hasFreeCancellation)}
          />
          Miễn phí hủy phòng
        </label>
      </div>

      <button className="apply-button" onClick={applyFilters}>Áp dụng</button>
    </div>
  );
};

export default FilterComponent;