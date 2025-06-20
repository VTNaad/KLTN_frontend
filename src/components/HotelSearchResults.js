import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FilterComponent from "./FilterComponent";
import HotelListComponent from "./HotelListComponent";
import "../css/HotelSearchResults.css";

const HotelSearchResults = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const initialHotels = location.state?.results || [];

  const [hotels, setHotels] = useState(initialHotels);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = async (filters) => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/hotels/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi gọi API tìm kiếm");
      }

      const data = await response.json();
      setHotels(data || []);
    } catch (error) {
      console.error("Lỗi khi tìm khách sạn:", error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hotel-results-container">
      <h2>Kết quả tìm kiếm: {hotels.length} khách sạn</h2>
      <div className="hotel-results">
        <div className="filters">
          <FilterComponent onFilterChange={handleFilterChange} />
        </div>
        <div className="hotel-listing">
          {loading ? <p>Đang tải dữ liệu...</p> : <HotelListComponent hotels={hotels} />}
        </div>
      </div>
    </div>
  );
};

export default HotelSearchResults;
