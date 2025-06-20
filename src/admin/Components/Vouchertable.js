import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../Context/darkModeContext";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import "../Style/lessontable.scss";
import { jwtDecode } from "jwt-decode";

const Vouchertable = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role; // Lấy role từ token
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch(`${apiUrl}/vouchers`);
        const data = await response.json();
        if (data) {
          const formattedData = data.map((voucher) => ({
            id: voucher._id,
            ...voucher,
          }));
          setData(formattedData);
        } else {
          console.error("Failed to fetch vouchers", data.message);
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [apiUrl]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/vouchers/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result) {
        setData((prevData) => prevData.filter((voucher) => voucher.id !== id));
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
    }
  };

  // Cấu hình cột cho DataGrid
  const columns = [
    { field: "code", headerName: "Voucher", width: 170 },
    { field: "discountType", headerName: "Discount Type", width: 120 },
    { field: "discountValue", headerName: "Discount Value", width: 120 },
    {
      field: "hotelId",
      headerName: "Hotel Name",
      width: 250,
      renderCell: (params) => {
        return <div>{params.row.hotelId?.name || "Tất cả khách sạn"}</div>;
      },
    },
    {
      field: "expiresAt",
      headerName: "Time Expires",
      width: 200,
      renderCell: (params) => {
        const date = new Date(params.row.expiresAt).toLocaleDateString("en-US");
        return <div>{date}</div>;
      },
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        // if (userRole === 2) {
        //   return <div style={{ color: "gray" }}>No Access</div>; // Hiển thị thông báo "No Access" nếu userRole = 2
        // }
        return (
          <div className="cellAction">
            <Link
              to={`/admin/vouchers/${params.row.id}/edit`}
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

export default Vouchertable;
