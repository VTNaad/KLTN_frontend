import React, { useState } from "react";
import "../Style/filter.scss"; // Đảm bảo import file CSS

const HotelFilter = ({ onFilter }) => {
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [amenities, setAmenities] = useState("");

  const handleFilter = () => {
    onFilter({ province, district, minPrice, maxPrice, amenities });
  };

  return (
    <div className="filters-container">
      <div className="input-row">
        <input
          type="text"
          placeholder="Province"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        />
        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amenities (e.g., Wifi,Pool)"
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
        />
      </div>
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};

export default HotelFilter;
