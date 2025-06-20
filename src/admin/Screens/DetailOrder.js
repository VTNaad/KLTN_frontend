import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Chart from "../Config/Chart";
import List from "../Components/List";
import "../Style/single.scss";

const DetailOrder = () => {
  const { orderId } = useParams(); // Lấy orderId từ URL
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/orders/${orderId}`);
        const data = await response.json();
        if (data.success) {
          setOrderData(data.data);
          console.log(data.data);
        } else {
          setError("Failed to fetch order details." + data.message);
        }
      } catch (err) {
        setError("An error occurred while fetching order details." + err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, apiUrl]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <h1 className="title">Order Information</h1>
            {/* <span className="editButton">Edit</span> */}
            <div className="item">
              <img
                src={orderData?.imageRoom || "/assets/default-avatar.jpg"}
                alt={`${orderData?.roomName || "User"}'s avatar`}
                className="itemImg"
              />
              <div className="details">
                {/* <h1 className="itemTitle">
                  {orderData?.hotelName || "Unknown Hotel"}
                </h1> */}

                <div className="detailItem">
                  <span className="itemkey">Hotel Name:</span>
                  <span className="itemValue">
                    {orderData?.hotelName || "N/A"}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemkey">Room Name:</span>
                  <span className="itemValue">
                    {orderData?.roomName || "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Quantity:</span>
                  <span className="itemValue">
                    {orderData?.quantity || "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Price Paid:</span>
                  <span className="itemValue">
                    {orderData?.totalPrice
                      ? `${orderData.totalPrice.toLocaleString()} VNĐ`
                      : "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Base Paid:</span>
                  <span className="itemValue">
                    {orderData?.originalPrice
                      ? `${orderData.originalPrice.toLocaleString()} VNĐ`
                      : "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Commission:</span>
                  <span className="itemValue">
                    {orderData?.commission
                      ? `${orderData.commission.toLocaleString()} VNĐ`
                      : "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Net Revenue:</span>
                  <span className="itemValue">
                    {orderData?.netRevenue
                      ? `${orderData.netRevenue.toLocaleString()} VNĐ`
                      : "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Status:</span>
                  <span className="itemValue">
                    {orderData?.status || "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Account:</span>
                  <div className="itemValue" style={{ marginLeft: "8px" }}>
                    <div>
                      <strong>Username:</strong>{" "}
                      {orderData?.user?.username || "N/A"}
                    </div>
                    <div>
                      <strong>Full Name:</strong>{" "}
                      {orderData?.user?.fullname || "N/A"}
                    </div>
                    <div>
                      <strong>Email:</strong> {orderData?.user?.email || "N/A"}
                    </div>
                    <div>
                      <strong>Phone:</strong> {orderData?.user?.phone || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="detailItem">
                  <span className="itemkey">User Contact Info:</span>
                  <span className="itemValue">
                    {orderData?.contactInfo?.fullName || "N/A"} -{" "}
                    {orderData?.contactInfo?.email || "N/A"} -{" "}
                    {orderData?.contactInfo?.phone || "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">
                    Guest Info(Booking for others):
                  </span>
                  <span className="itemValue">
                    {orderData?.guestInfo?.fullName &&
                    orderData?.guestInfo?.email &&
                    orderData?.guestInfo?.phone ? (
                      <>
                        {orderData.guestInfo.fullName} -{" "}
                        {orderData.guestInfo.email} -{" "}
                        {orderData.guestInfo.phone}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Booking Date:</span>
                  <span className="itemValue">
                    {new Date(orderData?.bookingDate).toLocaleDateString() ||
                      "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Note:</span>
                  <span className="itemValue">{orderData?.note || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="right">
          <Chart aspect={3 / 1} title="Orders Spending (Last 6 Months)" />
        </div> */}
      </div>
    </div>
  );
};

export default DetailOrder;
