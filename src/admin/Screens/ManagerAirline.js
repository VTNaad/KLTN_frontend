import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/managerlesson.scss";
import { Link } from "react-router-dom";
import Airlinetable from "../Components/Airlinetable";
import { jwtDecode } from "jwt-decode";
import AirlineFilter from "../Components/AirlineFilter";

const ManagerAirline = () => {
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
            <span>Airline Management</span>
            <Link
              to="/admin/airlines/airlineId/new"
              style={{
                textDecoration: "none",
                // pointerEvents: userRole === 2 ? "none" : "auto",
                // opacity: userRole === 2 ? 0.5 : 1,
              }}
            >
              <span className="link">Add New Airline</span>
            </Link>
          </div>
          <AirlineFilter onFilter={handleFilter} />
          <Airlinetable filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default ManagerAirline;
