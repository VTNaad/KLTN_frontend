import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HotelSearch = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await fetch(`${apiUrl}/hotels/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          province,
          district,
          minPrice,
          maxPrice,
        }),
      });

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        // Nếu trả về mảng thì truyền data luôn
        navigate("/resultHotel", { state: { results: data } });
      } else {
        console.error("Search failed or no results", data);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };
  return (
    <div className="search-content">
      <input type="text" placeholder="Tỉnh/Thành" value={province} onChange={(e) => setProvince(e.target.value)} />
      <input type="text" placeholder="Quận/Huyện" value={district} onChange={(e) => setDistrict(e.target.value)} />
      <input type="number" placeholder="Giá thấp nhất" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
      <input type="number" placeholder="Giá cao nhất" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      <button onClick={handleSearch}>🔍</button>
    </div>
  );
};

export default HotelSearch;
