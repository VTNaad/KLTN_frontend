import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../Context/darkModeContext";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../Style/lessontable.scss";

const Hoteltable = ({ filters }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const query = new URLSearchParams(filters).toString();
        const url = query
          ? `${apiUrl}/hotels/filter?${query}`
          : `${apiUrl}/hotels`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
          const filteredData =
            userRole === 4
              ? data.data.filter((hotel) => hotel._id === decodedToken.hotelId)
              : data.data;
          const formattedData = filteredData.map((hotel) => ({
            id: hotel._id,
            ...hotel,
          }));
          setData(formattedData);
        } else {
          console.error("Failed to fetch hotels", data.message);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [apiUrl, filters]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/hotels/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setData((prevData) => prevData.filter((hotel) => hotel.id !== id));
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  };

  // Cấu hình cột cho DataGrid
  const columns = [
    // { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Hotel Name", width: 350 },
    {
      field: "province",
      headerName: "Province/City",
      width: 200,
      renderCell: (params) => {
        return <div className="cellScroll">{params.row.province}</div>;
      },
    },
    {
      field: "district",
      headerName: "District",
      width: 200,
      renderCell: (params) => {
        return <div className="cellScroll">{params.row.district}</div>;
      },
    },
    // {
    //   field: "amenities",
    //   headerName: "Amenities",
    //   width: 200,
    //   renderCell: (params) => {
    //     return (
    //       <div className="cellScroll">
    //         {params.row.amenities?.map((item, index) => (
    //           <div key={index}>{item}</div>
    //         ))}
    //       </div>
    //     );
    //   },
    // },
    { field: "pricePerNight", headerName: "Min Room Price", width: 150 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        // if (userRole === 1) {
        //   return <div style={{ color: "gray" }}>No Access</div>; // Hiển thị thông báo "No Access" nếu userRole = 2
        // }
        return (
          <div className="cellAction">
            <Link
              to={`/admin/hotels/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">View</div>
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
        {loading ? (
          <p>Loading...</p>
        ) : (
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
        )}
      </Paper>
    </div>
  );
};

export default Hoteltable;
