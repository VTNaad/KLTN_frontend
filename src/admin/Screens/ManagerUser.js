import React from "react";
import Datatable from "../Components/Datatable";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/manageruser.scss";

const Customers = () => {
  return (
    <div className="customers">
      <>
        <Sidebar />
        <div className="customersContainer">
          <Navbar />
          <Datatable />
        </div>
      </>
    </div>
  );
};

export default Customers;
