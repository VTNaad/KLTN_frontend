import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/managerlesson.scss";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Hoteltable from "../Components/Hoteltable";
import HotelFilter from "../Components/HotelFilter";

const ManagerHotel = () => {
  const token = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  const [filters, setFilters] = useState({});

  const handleFilter = (filterData) => {
    setFilters(filterData);
  };

  return (
    <div className="product">
      <Sidebar />
      <div className="productContainer">
        <Navbar />
        <div className="productList">
          <div className="datatableTitle">
            <span>Hotel & Service Management</span>
            <Link
              to="/admin/hotels/hotelId/new"
              style={{
                textDecoration: "none",
                // pointerEvents: userRole === 2 ? "none" : "auto",
                // opacity: userRole === 2 ? 0.5 : 1,
              }}
            >
              <span className="link">Add New Hotel & Service</span>
            </Link>
          </div>
          <HotelFilter onFilter={handleFilter} />
          <Hoteltable filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default ManagerHotel;
