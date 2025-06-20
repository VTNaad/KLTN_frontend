import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Chart from "../Config/Chart";
import List from "../Components/List";
import "../Style/single.scss";

const DetailUser = () => {
  const { userId } = useParams(); // Lấy ID từ URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/${userId}`);
        const data = await response.json();
        if (data.success) {
          setUserData(data.user);
        } else {
          setError("Failed to fetch user details.");
        }
      } catch (err) {
        setError("An error occurred while fetching user details: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, apiUrl]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <h1 className="title">User Information</h1>
            {/* <span className="editButton">Edit</span> */}
            <div className="item">
              <img
                src={userData?.avatar || "/assets/default-avatar.jpg"}
                alt={`${userData?.fullname || "User"}'s avatar`}
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">
                  {userData?.username || "Unknown Username"}
                </h1>

                <div className="detailItem">
                  <span className="itemkey">Full Name:</span>
                  <span className="itemValue">
                    {userData?.fullname || "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Email:</span>
                  <span className="itemValue">{userData?.email || "N/A"}</span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Phone:</span>
                  <span className="itemValue">{userData?.phone || "N/A"}</span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Provider:</span>
                  <span className="itemValue">
                    {userData?.provider || "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Role:</span>
                  <span className="itemValue">
                    {userData?.role === 1
                      ? "Admin"
                      : userData?.role === 2
                      ? "Staff"
                      : userData?.role === 3
                      ? "Customer"
                      : "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Status:</span>
                  <span className="itemValue">
                    {userData?.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="right">
          <Chart aspect={3 / 1} title="Users Spending ( Last 6 Months )" />
        </div>
        <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          { <List /> }
        </div> */}
      </div>
    </div>
  );
};

export default DetailUser;
