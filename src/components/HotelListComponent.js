import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HotelListComponent = ({ hotels, onRemoveFavorite, showFavoriteIcon }) => {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  if (!hotels || hotels.length === 0) {
    return <p>Không có kết quả phù hợp.</p>;
  }

  return (
    <div className="hotel-list">
      {hotels.map((hotel, index) => (
        <div key={hotel._id || index} className="hotel-item">
          <div className="hotel-image-slider">
            <Slider {...sliderSettings}>
              {hotel.images.map((image, imgIndex) => (
                <img
                  key={imgIndex}
                  src={image}
                  alt={hotel.name}
                  className="hotel-image"
                />
              ))}
            </Slider>
          </div>
          <div className="hotel-info">
            <div className="flex justify-between items-center">
              <h4 className="hotel-name">{hotel.name}</h4>
              {showFavoriteIcon && (
                <button
                  onClick={() => onRemoveFavorite(hotel._id)}
                  className="text-red-500 text-xl"
                  title="Xóa khỏi yêu thích"
                >
                  ❤️
                </button>
              )}
            </div>
            <p className="hotel-location">{hotel.address}</p>
            <p className="hotel-rating">
              <span className="rating-badge">{hotel.starRating}</span> Tuyệt vời
            </p>
            <ul className="hotel-features">
              {hotel.amenities.map((feature, featureIndex) => (
                <li key={featureIndex}>✅ {feature}</li>
              ))}
            </ul>
            <div className="hotel-pricing">
              <span className="discounted-price">
                {hotel.pricePerNight.toLocaleString()}₫
              </span>
            </div>
            <button
              className="book-button"
              onClick={() => navigate(`/hotelInfo?id=${hotel._id}`)}
            >
              Xem phòng
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelListComponent;
