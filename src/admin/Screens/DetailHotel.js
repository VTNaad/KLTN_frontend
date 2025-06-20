import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Chart from "../Config/Chart";
import List from "../Components/List";
import "../Style/detailHotel.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";

const DetailHotel = () => {
  const { hotelId } = useParams(); // Lấy hotelId từ URL
  const [hotelData, setHotelData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/hotels/${hotelId}`);
        const data = await response.json();
        if (data.success) {
          setHotelData(data.data);
        } else {
          setError("Failed to fetch hotel details.");
        }
      } catch (err) {
        setError("An error occurred while fetching hotel details: " + err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await fetch(`${apiUrl}/rooms/hotel/${hotelId}`);
        const data = await response.json();
        if (data.success) {
          const formattedRooms = data.data.map((room) => ({
            id: room._id,
            ...room,
          }));
          setRooms(formattedRooms);
        } else {
          console.error("Failed to fetch rooms", data.message);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };

    fetchHotelDetails();
    fetchRooms();
  }, [hotelId, apiUrl]);

  const handleDeleteRoom = async (roomId) => {
    try {
      const response = await fetch(`${apiUrl}/rooms/${roomId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const images = hotelData?.images || ["/assets/default-avatar.jpg"];

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const roomColumns = [
    { field: "name", headerName: "Room Name", width: 300 },
    { field: "people", headerName: "People", width: 150 },
    { field: "beds", headerName: "Beds", width: 200 },
    { field: "area", headerName: "Area", width: 150 },
    { field: "price", headerName: "Price", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/admin/rooms/${params.row.id}/edit`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton">Edit</div>
          </Link>
          <div
            className="deleteButton"
            onClick={() => handleDeleteRoom(params.row.id)}
          >
            Delete
          </div>
        </div>
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <h1 className="title">Hotel Information</h1>
            <Link
              to={`/admin/hotels/${hotelId}/edit`}
              style={{ textDecoration: "none" }}
            >
              <span className="editButton">Edit</span>
            </Link>
            <div className="item">
              <div className="itemImgWrapper">
                <div className="arrow left" onClick={handlePrev}>
                  <FaChevronLeft />
                </div>
                <img
                  src={images[currentImageIndex]}
                  alt={`${hotelData?.name || "Hotel"}'s image`}
                  className="itemImg"
                />
                <div className="arrow right" onClick={handleNext}>
                  <FaChevronRight />
                </div>
              </div>
              <div className="details">
                <h1 className="itemTitle">
                  {hotelData?.name || "Unknown Hotel"}
                </h1>

                <div className="detailItem">
                  <span className="itemkey">Address:</span>
                  <span className="itemValue">
                    {hotelData?.address || "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Province:</span>
                  <span className="itemValue">
                    {hotelData?.province || "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Location:</span>
                  <span className="itemValue">
                    {hotelData?.location
                      ? `Lat: ${hotelData.location.lat}, Lng: ${hotelData.location.lng}`
                      : "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Check-In Time:</span>
                  <span className="itemValue">
                    {hotelData?.checkInTime || "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Check-Out Time:</span>
                  <span className="itemValue">
                    {hotelData?.checkOutTime || "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Policies:</span>
                  <span className="itemValue">
                    <div>
                      {hotelData?.policies ? (
                        <>
                          <div style={{ marginLeft: "50px" }}>
                            Cancellation:{" "}
                            {hotelData.policies.cancellationPolicy || "N/A"}
                          </div>
                          <div style={{ marginLeft: "50px" }}>
                            Payment: {hotelData.policies.paymentPolicy || "N/A"}
                          </div>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Contact:</span>
                  <span className="itemValue">
                    <div>
                      {hotelData?.contact ? (
                        <>
                          <div style={{ marginLeft: "50px" }}>
                            Phone: {hotelData.contact.phone || "N/A"}
                          </div>
                          <div style={{ marginLeft: "50px" }}>
                            Email: {hotelData.contact.email || "N/A"}
                          </div>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Price Per Night:</span>
                  <span className="itemValue">
                    {hotelData?.pricePerNight
                      ? `${hotelData.pricePerNight.toLocaleString()} VNĐ`
                      : "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Star Rating:</span>
                  <span className="itemValue">
                    {hotelData?.starRating
                      ? `${hotelData.starRating} ★`
                      : "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Amenities:</span>
                  <span className="itemValue">
                    {hotelData?.amenities?.join(", ") || "N/A"}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemkey">Description:</span>
                  <span className="itemValue">
                    {hotelData?.description || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="roomList">
            <div className="datatableTitle">
              <span>List Of Hotel Rooms</span>
              <Link
                to={`/admin/rooms/roomId/new?hotelId=${hotelId}`}
                style={{ textDecoration: "none" }}
              >
                <span className="link">Add New Room</span>
              </Link>
            </div>
            <Paper className="productContainer">
              <DataGrid
                className="datagrid"
                rows={rooms}
                columns={roomColumns}
                pageSize={10}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                checkboxSelection
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 5, page: 0 },
                  },
                }}
              />
            </Paper>
          </div>
        </div>
        {/* <div className="right">
          <Chart aspect={3 / 1} title="Orders Spending (Last 6 Months)" />
        </div> */}
      </div>
    </div>
  );
};

export default DetailHotel;
