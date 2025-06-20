import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const VoucherCarousel = () => {
  const [vouchers, setVouchers] = useState([]);
  const navigate = useNavigate(); // ✅ hook điều hướng

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const res = await fetch(`${apiUrl}/vouchers`);
        const data = await res.json();

        const now = new Date();
        const validVouchers = data.filter(
          (voucher) => !voucher.expiresAt || new Date(voucher.expiresAt) > now
        );

        setVouchers(validVouchers);
      } catch (err) {
        console.error("Lỗi khi tải voucher:", err);
      }
    };

    fetchVouchers();
  }, []);

  const handleClick = (id) => {
    navigate(`/voucher/${id}`); // ✅ chuyển đến trang chi tiết
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: Math.min(2, vouchers.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="voucher-carousel" style={{ maxWidth: "95%", margin: "auto", padding: "20px 0" }}>
      {vouchers.length === 0 ? (
        <p>Không có voucher khả dụng</p>
      ) : (
        <Slider {...settings}>
          {vouchers.map((voucher) => (
            <div
              key={voucher._id}
              style={{ padding: "0 10px", cursor: "pointer" }}
              onClick={() => handleClick(voucher._id)} // ✅ click dẫn link
            >
              <img
                src={voucher.image}
                alt={`Voucher ${voucher.code}`}
                style={{
                  width: "90%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default VoucherCarousel;
