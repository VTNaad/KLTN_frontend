import React, { useEffect, useState } from "react";
import HotelListComponent from "./HotelListComponent";

const FavoriteList = () => {
  const [favoriteHotels, setFavoriteHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchFavorites = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    const user = JSON.parse(userStr);
    if (!user || !user._id) return;

    try {
      const response = await fetch(`${apiUrl}/favorites/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setFavoriteHotels(data.favoriteHotels || []);
      } else {
        console.error("Lỗi khi lấy danh sách yêu thích");
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (hotelId) => {
    const userStr = localStorage.getItem("user");
    const user = JSON.parse(userStr);
    if (!user || !user._id) return;

    try {
      const res = await fetch(`${apiUrl}/favorites/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, hotelId }),
      });

      const data = await res.json();
      if (data.success) {
        // Cập nhật lại danh sách sau khi xoá
        fetchFavorites();
      } else {
        console.error("Không thể xoá khỏi yêu thích");
      }
    } catch (err) {
      console.error("Lỗi khi xoá yêu thích:", err);
    }
  };

  if (loading) {
    return <p>Đang tải danh sách yêu thích...</p>;
  }

  return (
    <div className="favorite-list">
      <h2>Danh sách khách sạn yêu thích</h2>
      <HotelListComponent
        hotels={favoriteHotels}
        onRemoveFavorite={handleRemoveFavorite}
        showFavoriteIcon={true}
      />
    </div>
  );
};

export default FavoriteList;
