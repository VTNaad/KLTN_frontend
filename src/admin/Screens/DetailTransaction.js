import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/detailHotel.scss";
import { Paper, Typography, Divider, Chip } from "@mui/material";
import { format } from "date-fns";

const DetailTransaction = () => {
  const { type, id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/transactions/${type}/${id}`
        );
        const data = await response.json();

        if (data.success) {
          setTransaction(data.data);
        } else {
          setError("Failed to fetch transaction details.");
        }
      } catch (err) {
        setError("An error occurred: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [type, id, apiUrl]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!transaction) return <p>Transaction not found</p>;

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <h1 className="title">Transaction Details</h1>
            <div className="item">
              <div className="details">
                <Typography variant="h5" gutterBottom>
                  {type === "hotel" ? "Hotel Booking" : "Flight Booking"}
                </Typography>
                <Divider style={{ margin: "10px 0" }} />

                <div className="detailItem">
                  <span className="itemkey">Transaction ID:</span>
                  <span className="itemValue">{transaction._id}</span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Date:</span>
                  <span className="itemValue">
                    {format(new Date(transaction.createdAt), "PPPpp")}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">User:</span>
                  <span className="itemValue">
                    {transaction.user?.fullname} ({transaction.user?.email})
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Price:</span>
                  <span className="itemValue">
                    {transaction.price.toLocaleString()} VND
                  </span>
                </div>

                {type === "hotel" && (
                  <>
                    <Divider style={{ margin: "20px 0" }} />
                    <Typography variant="h6" gutterBottom>
                      Hotel Information
                    </Typography>
                    <div className="detailItem">
                      <span className="itemkey">Hotel:</span>
                      <span className="itemValue">
                        {transaction.hotel?.name}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemkey">Room:</span>
                      <span className="itemValue">
                        {transaction.room?.name}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemkey">Cancellation Policy:</span>
                      <span className="itemValue">
                        {transaction.cancellationPolicy}
                      </span>
                    </div>
                  </>
                )}

                {type === "flight" && (
                  <>
                    <Divider style={{ margin: "20px 0" }} />
                    <Typography variant="h6" gutterBottom>
                      Flight Information
                    </Typography>
                    <div className="detailItem">
                      <span className="itemkey">Flight:</span>
                      <span className="itemValue">
                        {transaction.flight?.flightNumber}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemkey">Departure:</span>
                      <span className="itemValue">
                        {transaction.flight?.departureAirport} -{" "}
                        {format(
                          new Date(transaction.flight?.departureTime),
                          "PPPpp"
                        )}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemkey">Arrival:</span>
                      <span className="itemValue">
                        {transaction.flight?.arrivalAirport} -{" "}
                        {format(
                          new Date(transaction.flight?.arrivalTime),
                          "PPPpp"
                        )}
                      </span>
                    </div>
                  </>
                )}

                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="h6" gutterBottom>
                  Order Information
                </Typography>
                <div className="detailItem">
                  <span className="itemkey">Order ID:</span>
                  <span className="itemValue">{transaction.order?._id}</span>
                </div>
                <div className="detailItem">
                  <span className="itemkey">Status:</span>
                  <span className="itemValue">
                    <Chip
                      label={transaction.order?.status}
                      color={
                        transaction.order?.status === "completed"
                          ? "success"
                          : transaction.order?.status === "cancelled"
                          ? "error"
                          : "warning"
                      }
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTransaction;