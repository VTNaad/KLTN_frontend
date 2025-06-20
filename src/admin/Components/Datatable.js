import React, { useState, useEffect, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../Config/datatableSource";
import { DarkModeContext } from "../Context/darkModeContext";
import "../Style/datatable.scss";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Datatable = () => {
  const { darkMode } = useContext(DarkModeContext);

  const apiUrl = process.env.REACT_APP_API_URL;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const datas = await response.json();

      if (response.ok && datas.success) {
        setData(data.filter((item) => item.id !== id));
        alert("User Deleted successfully!");
      } else {
        alert(datas.message || "Failed to delete the user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while trying to delete the user.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data.success) {
          const roleMap = {
            1: "Admin",
            2: "Staff",
            3: "Customer",
            4: "Hotel Manager",
          };

          const formattedData = data.users.map((user) => ({
            id: user._id,
            ...user,
            roleName: roleMap[user.role] || "Unknown", // chuyển role số thành chữ
          }));

          const sortedData = formattedData.sort((a, b) => b.role - a.role);
          setData(sortedData);
        } else {
          setError("No data available");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        if (userRole === 2) {
          return <div style={{ color: "gray" }}>No Access</div>; // Hiển thị thông báo "No Access" nếu userRole = 2
        }
        return (
          <div className="cellAction">
            <Link
              to={`/admin/users/${params.row.id}`}
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
    <div className="datatable">
      <div className="datatableTitle">
        <span>User Management</span>
        <Link
          to="/admin/users/userId/new"
          style={{
            textDecoration: "none",
            pointerEvents: userRole === 2 ? "none" : "auto",
            opacity: userRole === 2 ? 0.5 : 1,
          }}
        >
          <span className="link">Add New User</span>
        </Link>
        <Link
          to="/admin/user/managerId/new"
          style={{
            textDecoration: "none",
            pointerEvents: userRole === 2 ? "none" : "auto",
            opacity: userRole === 2 ? 0.5 : 1,
          }}
        >
          <span className="link">Add Hotel Manager</span>
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <DataGrid
          className="datagrid"
          rows={data}
          columns={userColumns.concat(actionColumn)}
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
    </div>
  );
};

export default Datatable;
