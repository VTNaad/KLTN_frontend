import React, { useState } from "react";
import Modal from "./Modal";
import "../css/HotelImages.css";

const HotelImages = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return <p>Không có hình ảnh nào để hiển thị.</p>;
  }

  const mainImage = images[0];
  const galleryImages = images.slice(1, 4);

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleNext = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const modalContent = (
    <div className="image-modal-content">
      <div className="main-image-container">
        <button className="nav-button prev" onClick={handlePrev}>&lt;</button>
        <img 
          src={images[selectedImageIndex]} 
          alt={`Hotel ${selectedImageIndex + 1}`} 
          className="modal-main-image"
        />
        <button className="nav-button next" onClick={handleNext}>&gt;</button>
      </div>
      <div className="thumbnail-container">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
            onClick={() => setSelectedImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="hotel-images">
      {/* Main image */}
      <img 
        src={mainImage} 
        alt="Main" 
        className="main-image" 
        onClick={() => openImageModal(0)}
      />
      
      {/* Gallery images */}
      <div className="image-gallery">
        {galleryImages.map((img, index) => (
          <img 
            key={index + 1}
            src={img} 
            alt={`Gallery ${index + 1}`} 
            onClick={() => openImageModal(index + 1)}
          />
        ))}
        {images.length > 4 && (
          <div 
            className="more-images"
            onClick={() => openImageModal(0)}
          >
            +{images.length - 4} Ảnh
          </div>
        )}
      </div>

      {/* Image modal */}
      {isModalOpen && (
        <Modal
          content={modalContent}
          closeModal={() => setIsModalOpen(false)}
          width="90%"
          height="90vh"
        />
      )}
    </div>
  );
};

export default HotelImages;