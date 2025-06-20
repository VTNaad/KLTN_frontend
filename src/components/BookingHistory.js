import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import "../css/BookingHistory.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingHistory = () => {
  const [orders, setOrders] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    fetchOrders();
  }, [apiUrl]);

  const fetchOrders = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))?._id;
      const response = await fetch(`${apiUrl}/orders/user/${userId}`);
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        // Lọc chỉ hiển thị các đơn có status khác "Cancelled"
        const activeOrders = data.data.filter(
          (order) => order.status !== "Cancelled"
        );
        setOrders(activeOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Processing" }),
      });

      if (response.ok) {
        // Hiển thị thông báo cho khách hàng
        toast.success("Yêu cầu hủy đơn đã được gửi đến quản trị viên", {
          position: "top-right",
          autoClose: 3000,
        });
        fetchOrders();
      } else {
        toast.error("Hủy đơn không thành công");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Đã xảy ra lỗi khi hủy đơn");
    }
  };

  const handlePayment = async (orderId, totalPrice) => {
    try {
      const response = await fetch(`${apiUrl}/payment/create_payment_url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice,
          bankCode: "",
          language: "vn",
          serviceType: "Order",
        }),
      });

      const data = await response.json();
      if (data.url) {
        // Lưu thông tin orderId vào localStorage để xử lý sau khi thanh toán
        localStorage.setItem("paymentOrderId", orderId);
        window.location.href = data.url; // Chuyển hướng đến VNPay
      } else {
        alert("Không thể tạo thanh toán. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Có lỗi xảy ra khi thanh toán!");
    }
  };

  const handlePaymentReturn = async (success) => {
    const orderId = localStorage.getItem("paymentOrderId");
    localStorage.removeItem("paymentOrderId");

    if (success) {
      try {
        const response = await fetch(`${apiUrl}/orders/${orderId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Paid" }),
        });

        if (response.ok) {
          alert("Thanh toán thành công!");
          navigate("/account?tab=booking"); // Quay lại trang BookingHistory
        } else {
          alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại!");
          navigate("/account?tab=booking");
        }
      } catch (error) {
        console.error("Error updating order status:", error);
        alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!");
      }
    } else {
      alert("Thanh toán thất bại. Vui lòng thử lại!");
      navigate("/account?tab=booking"); // Quay lại trang BookingHistory
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");

    if (hasProcessedRef.current) return;

    if (success === "true") {
      handlePaymentReturn(true);
      hasProcessedRef.current = true;
    } else if (success === "false") {
      handlePaymentReturn(false);
      hasProcessedRef.current = true;
    }
  }, [handlePaymentReturn]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
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
      <h3>Danh sách đơn phòng</h3>
      <ToastContainer />
      <p>Xem lại các đơn phòng đã đặt trước đây tại đây.</p>
      {Array.isArray(orders) && orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="order-item form-grid">
            <div className="order-image">
              <img
                src={order.imageRoom || "../assets/Premium.jpg"}
                alt="Room"
              />
            </div>
            <div className="order-details">
              <h4 className="hotel-name">
                {order.hotelName || "Tên khách sạn"}
              </h4>
              <p>
                Phòng:{" "}
                <span className="room-name">
                  {order.roomName || "Loại phòng"}
                </span>
              </p>
              <p>
                Giá:{" "}
                <span className="total-price">
                  {order.totalPrice?.toLocaleString() || "0"} VND
                </span>
              </p>
              <p>
                Trạng thái:{" "}
                <span className={getStatusClass(order.status)}>
                  {order.status}
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

              {order.status === "Paid" && (
                <button
                  className="cancel-button"
                  onClick={() => handleCancelOrder(order._id)}
                >
                  <FaTimes /> Hủy đơn
                </button>
              )}

              {order.status === "Reserved" && (
                <button
                  className="payment-button"
                  onClick={() => handlePayment(order._id, order.totalPrice)}
                >
                  Thanh toán ngay
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>Không có đơn phòng nào.</p>
      )}
    </div>
  );
};

export default BookingHistory;
