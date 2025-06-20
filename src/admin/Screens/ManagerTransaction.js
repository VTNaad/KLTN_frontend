import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/managerlesson.scss";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TransactionTable from "../Components/TransactionTable";
import TransactionFilter from "../Components/TransactionFilter";

const ManagerTransaction = () => {
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
            <span>Transaction Management</span>
          </div>
          {/* <TransactionFilter onFilter={handleFilter} /> */}
          <TransactionTable filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default ManagerTransaction;