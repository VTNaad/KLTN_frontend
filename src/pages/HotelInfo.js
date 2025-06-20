import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import HotelHeader from "../components/HotelHeader";
import HotelImages from "../components/HotelImages";
import HotelReviews from "../components/HotelReviews";
// import HotelReview2 from "../components/HotelReviews2";
import HotelAmenities from "../components/HotelAmenities";
import HotelLocation from "../components/HotelLocation";
import Propose from "../components/Propose"; // ✅ Thêm Propose Component
import Modal from "../components/Modal";
import "../css/HotelInfoPage.css";

const HotelInfo = () => {
  const [searchParams] = useSearchParams();
  const hotelId = searchParams.get("id");
  const [hotel, setHotel] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const proposeRef = useRef(null); // ✅ ref cho Propose
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/hotels/${hotelId}`);
        const data = await response.json();
        if (data) setHotel(data);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };

    if (hotelId) fetchHotelDetails();
  }, [hotelId, apiUrl]);

  const openModal = (content) => {
    setModalContent(content);
  };

  // ✅ Hàm scroll xuống Propose
  const scrollToPropose = () => {
    if (proposeRef.current) {
      proposeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!hotel) return <p>Loading...</p>;

  return (
    <div className="hotel-container">
      <HotelHeader hotel={hotel.data} onBookClick={scrollToPropose} /> {/* 👈 */}
      <HotelImages images={hotel.data.images} />
      <div className="hotel-details">
        <HotelReviews hotelId={hotelId} openModal={openModal} />
        <HotelAmenities
          amenities={hotel.data.amenities}
          openModal={openModal}
        />
        <HotelLocation 
          location={hotel.data.location} 
          address={hotel.data.address} // Thêm dòng này
          openModal={openModal} 
        />
      </div>

      {/* 👇 Gắn ref vào Propose */}
      <div ref={proposeRef}>
        <Propose
          hotelId={hotelId}
          openModal={(content) => setModalContent(content)}
        />
      </div>

      {modalContent && (
        <Modal
          content={modalContent}
          closeModal={() => setModalContent(null)}
        />
      )}
    </div>
  );
};

export default HotelInfo;