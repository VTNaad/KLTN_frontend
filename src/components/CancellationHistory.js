import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import "../css/BookingHistory.css";

const CancellationHistory = () => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCancelledOrders = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))._id;
        const response = await fetch(`${apiUrl}/orders/user/${userId}`);
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const cancelled = data.data.filter(order => order.status === "Cancelled");
          setCancelledOrders(cancelled);
        } else {
          setCancelledOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchCancelledOrders();
  }, [apiUrl]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Processing":
        return "status-processing";
      case "Pending":
        return "status-pending";
      case "Paid":
        return "status-paid";
      case "Cancelled":
        return "status-cancelled";
      case "Reserved":
        return "status-reserved";
      case "Refunded":
        return "status-refunded";
      default:
        return "status-default";
    }
  };

  return (
    <div className="booking-history">
      <h3>Lịch sử đơn hủy</h3>
      <p>Xem lại các đơn hủy trước đây tại đây.</p>

      {cancelledOrders.length > 0 ? (
        cancelledOrders.map((order) => (
          <div key={order._id} className="order-item form-grid">
            <div className="order-image">
              <img
                src={order.imageRoom || "../assets/Premium.jpg"}
                alt="Room"
              />
            </div>
            <div className="order-details">
              <h4 className="hotel-name">{order.hotelName || "Tên khách sạn"}</h4>
              <p>
                Phòng: <span className="room-name">{order.roomName || "Loại phòng"}</span>
              </p>
              <p>
                Giá: <span className="total-price">{order.totalPrice?.toLocaleString() || "0"} VND</span>
              </p>
              <p>
                Trạng thái: <span className={getStatusClass(order.status)}>{order.status}</span>
              </p>
              <p>
                Ngày đặt: <span className="booking-date">{new Date(order.createdAt).toLocaleDateString()}</span>
              </p>
              <p>
                Ngày hủy: <span className="booking-date">{new Date(order.updatedAt).toLocaleDateString()}</span>
              </p>
              <p>
                Ghi chú: <span className="note">{order.note || "Không có ghi chú"}</span>
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>Không có đơn hủy nào.</p>
      )}
    </div>
  );
};

export default CancellationHistory;