import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../Context/darkModeContext";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import "../Style/lessontable.scss";
import { jwtDecode } from "jwt-decode";

const Airlinetable = ({ filters }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const query = new URLSearchParams(filters).toString();
        const url = query
          ? `${apiUrl}/flights/filter?${query}`
          : `${apiUrl}/flights`;
        const response = await fetch(url);
        const data = await response.json();
        if (data) {
          const formattedData = data.map((flight) => ({
            id: flight._id,
            ...flight,
          }));
          setData(formattedData);
        } else {
          console.error("Failed to fetch flights", data.message);
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [apiUrl, filters]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/flights/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result) {
        setData((prevData) => prevData.filter((filght) => filght.id !== id));
      }
    } catch (error) {
      console.error("Error deleting filght:", error);
    }
  };

  // Cấu hình cột cho DataGrid
  const columns = [
    { field: "airline", headerName: "Airline", width: 120 },
    {
      field: "flightNumber",
      headerName: "Flight No.",
      width: 100,
    },
    {
      field: "departureTime",
      headerName: "Departure Time",
      width: 150,
      renderCell: (params) => {
        const date = new Date(params.row.departureTime).toLocaleString(
          "en-US",
          { timeZone: "Asia/Ho_Chi_Minh", hour12: false }
        );
        return <div>{date}</div>;
      },
    },
    {
      field: "arrivalTime",
      headerName: "Arrival Time",
      width: 150,
      renderCell: (params) => {
        const date = new Date(params.row.arrivalTime).toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour12: false,
        });
        return <div>{date}</div>;
      },
    },
    { field: "departure", headerName: "Departure", width: 120 },
    { field: "destination", headerName: "Destination", width: 120 },
    { field: "originalPrice", headerName: "Price", width: 100 },
    { field: "seatsAvailable", headerName: "Seats", width: 70 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        // if (userRole === 1) {
        //   return <div style={{ color: "gray" }}>No Access</div>; // Hiển thị thông báo "No Access" nếu userRole = 2
        // }
        return (
          <div className="cellAction">
            <Link
              to={`/admin/airlines/${params.row.id}/edit`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Edit</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="productable">
      <Paper className="productContainer">
        <DataGrid
          className="datagrid"
          rows={data}
          columns={columns.concat(actionColumn)}
          pageSize={10}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          checkboxSelection
          sx={{
            "& .MuiTablePagination-root": {
              color: darkMode ? "white" : "black",
            },
          }}
        />
      </Paper>
    </div>
  );
};

export default Airlinetable;
