import React, { useEffect, useState } from "react";
import "../css/BookingHistory.css";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FlightHistory = () => {
  const [orders, setOrders] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(`${apiUrl}/order-flight/user/${user._id}`);
        const data = await response.json();
        console.log("Flight orders:", data);
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching flight orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [apiUrl]);

  const handleCancelFlight = async (orderId) => {
    try {
      const response = await fetch(`${apiUrl}/order-flight/${orderId}/payment-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "processing" }),
      });

      if (response.ok) {
        toast.success("Yêu cầu hủy vé đã được gửi đến quản trị viên", {
          position: "top-right",
          autoClose: 3000,
        });

        const updatedOrders = orders.map(order =>
          order._id === orderId ? { ...order, status: "processing" } : order
        );
        setOrders(updatedOrders);
      } else {
        toast.error("Hủy vé không thành công");
      }
    } catch (error) {
      console.error("Error cancelling flight:", error);
      toast.error("Đã xảy ra lỗi khi hủy vé");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "confirmed":
        return "status-confirmed";
      case "cancelled":
        return "status-cancelled";
      case "processing":
        return "status-processing";
      default:
        return "status-default";
    }
  };

  return (
    <div className="booking-history">
      <h3>Danh sách vé máy bay đã đặt</h3>
      <ToastContainer />
      <p>Xem lại các đơn đặt vé máy bay của bạn tại đây.</p>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="order-item form-grid">
            <div className="order-image">
              <img
                src={order.flight?.image || "https://via.placeholder.com/150"}
                alt={order.flight?.airline}
                className="flight-logo"
              />
            </div>
            <div className="order-details">
              <h4 className="hotel-name">Thông tin chuyến bay</h4>
              <p>
                Hành trình:{" "}
                <span className="room-name">
                  {order.flight?.departure} → {order.flight?.destination}
                </span>
              </p>
              <p>
                Giá vé:{" "}
                <span className="total-price">
                  {order.totalPrice.toLocaleString()} VND
                </span>
              </p>
              <p>
                Hành khách:{" "}
                <span>
                  {order.passengerInfo.fullName} ({order.passengerInfo.email})
                </span>
              </p>
              <p>
                Trạng thái:{" "}
                <span className={getStatusClass(order.status)}>
                  {order.status}
                </span>
              </p>
              <p>
                Trạng thái thanh toán:{" "}
                <span className={getStatusClass(order.paymentStatus)}>
                  {order.paymentStatus}
                </span>
              </p>
              <p>
                Ngày đặt:{" "}
                <span className="booking-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </p>
              <p>
                Ghi chú:{" "}
                <span className="note">{order.note || "Không có ghi chú"}</span>
              </p>
            </div>
            {(order.status === "confirmed" || order.status === "pending") && (
              <button
                className="cancel-button"
                onClick={() => handleCancelFlight(order._id)}
              >
                <FaTimes /> Hủy vé
              </button>
            )}
          </div>
        ))
      ) : (
        <p>Không có đơn đặt vé nào.</p>
      )}
    </div>
  );
};

export default FlightHistory;
