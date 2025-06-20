import React from "react";
import "../css/SearchBox.css";

const VillaSearch = () => (
  <div className="search-content">
    <input type="text" placeholder="Địa điểm biệt thự, homestay" />
    <input type="date" placeholder="Ngày nhận phòng" />
    <input type="date" placeholder="Ngày trả phòng" />
    <select>
      <option>1 biệt thự, 4 người</option>
      <option>1 biệt thự, 6 người</option>
    </select>
    <button className="search-button">🔍</button>
  </div>
);

export default VillaSearch;
