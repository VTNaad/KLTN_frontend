import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FlightFilterComponent from "../components/FilterFlightComponent";
import FlightListComponent from "../components/FlightListComponent";
import "../css/FlightSearchResults.css";

const FlightSearchResults = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "";
  const location = useLocation();

  // Lấy filters truyền từ trang trước (departure, destination)
  const initialFilters = location.state?.filters || {};

  const [filters, setFilters] = useState(initialFilters);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm tìm chuyến bay theo filter
  const searchFlights = async (searchFilters) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/flights2/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchFilters),
      });

      if (!response.ok) throw new Error("Lỗi khi gọi API tìm chuyến bay");

      const data = await response.json();
      setFlights(data || []);
    } catch (error) {
      console.error("Lỗi khi tìm chuyến bay:", error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  // Tự động gọi API tìm chuyến bay lần đầu khi component mount nếu có filters ban đầu
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      searchFlights(filters);
    }
  }, [filters]);

  // Hàm xử lý khi filter thay đổi (ví dụ từ component FilterFlightComponent)
  const handleFilterChange = (newFilters) => {
    const mergedFilters = {
      ...newFilters,
      departure: filters.departure,
      destination: filters.destination,
    };
    setFilters(mergedFilters);
    searchFlights(mergedFilters);
  };

  return (
    <div className="flight-results-container">
      <h2>Kết quả tìm kiếm: {flights.length} chuyến bay</h2>
      <div className="flight-results">
        <aside className="filters">
          <FlightFilterComponent onFilterChange={handleFilterChange} />
        </aside>
        <main className="flight-listing">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : flights.length > 0 ? (
            <FlightListComponent flights={flights} />
          ) : (
            <p>Không tìm thấy chuyến bay phù hợp.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default FlightSearchResults;
