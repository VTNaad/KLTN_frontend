import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../Context/darkModeContext";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import "../Style/lessontable.scss";
import { jwtDecode } from "jwt-decode";

const Roomtable = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${apiUrl}/rooms`);
        const data = await response.json();
        if (data.success) {
          const filteredData =
            userRole === 4
              ? data.data.filter(
                  (room) => room.hotel._id === decodedToken.hotelId
                )
              : data.data;
          const sortedData = filteredData.sort((a, b) => {
            const nameA = a.hotel?.name?.toLowerCase() || "";
            const nameB = b.hotel?.name?.toLowerCase() || "";
            return nameA.localeCompare(nameB);
          });

          const formattedData = sortedData.map((room) => ({
            id: room._id,
            ...room,
          }));
          setData(formattedData);
        } else {
          console.error("Failed to fetch rooms", data.message);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [apiUrl]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/rooms/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setData((prevData) => prevData.filter((room) => room.id !== id));
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  // Cấu hình cột cho DataGrid
  const columns = [
    {
      field: "hotel",
      headerName: "Hotel Name",
      width: 230,
      renderCell: (params) => {
        return <div>{params.row.hotel?.name || "N/A"}</div>;
      },
    },
    { field: "name", headerName: "Room Name", width: 230 },
    { field: "people", headerName: "People", width: 80 },
    { field: "beds", headerName: "Bed", width: 150 },
    { field: "area", headerName: "Area", width: 150 },
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
    { field: "price", headerName: "Price", width: 80 },
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
              to={`/admin/rooms/${params.row.id}/edit`}
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

export default Roomtable;
