import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/managerlesson.scss";
import Voucherstable from "../Components/Vouchertable";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ManagerVouchers = () => {
  const token = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;
  return (
    <div className="product">
      <Sidebar />
      <div className="productContainer">
        <Navbar />
        <div className="productList">
          <div className="datatableTitle">
            <span>Voucher Management</span>
            <Link
              to="/admin/vouchers/voucherId/new"
              style={{
                textDecoration: "none",
                // pointerEvents: userRole === 2 ? "none" : "auto", // Vô hiệu hóa nút nếu userRole = 2
                // opacity: userRole === 2 ? 0.5 : 1, // Làm mờ nút nếu userRole = 2
              }}
            >
              <span className="link">Add New Vouchers</span>
            </Link>
          </div>
          <Voucherstable />
        </div>
      </div>
    </div>
  );
};

export default ManagerVouchers;
