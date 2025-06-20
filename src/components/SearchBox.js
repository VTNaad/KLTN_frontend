import React, { useState } from "react";
import HotelSearch from "./HotelSearch";
import FlightSearch from "./FlightSearch";
import VillaSearch from "./VillaSearch";
import "../css/SearchBox.css";

const SearchBox = () => {
  const [activeTab, setActiveTab] = useState("hotel");

  return (
    <div className="search-container">
      <div className="search-box">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "hotel" ? "active" : ""}`} 
            onClick={() => setActiveTab("hotel")}
          >
             🏨 Khách sạn
          </button>
          <button 
            className={`tab ${activeTab === "flight" ? "active" : ""}`} 
            onClick={() => setActiveTab("flight")}
          >
             ✈️ Vé máy bay
          </button>
          {/* <button 
            className={`tab ${activeTab === "villa" ? "active" : ""}`} 
            onClick={() => setActiveTab("villa")}
          >
            🏡 Biệt thự, Homestay
          </button> */}
        </div>

        {activeTab === "hotel" && <HotelSearch />}
        {activeTab === "flight" && <FlightSearch />}
        {activeTab === "villa" && <VillaSearch />}
      </div>
    </div>
  );
};

export default SearchBox;
