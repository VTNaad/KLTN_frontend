import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../Context/darkModeContext";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import "../Style/lessontable.scss";
import { jwtDecode } from "jwt-decode";

const Ordertable = () => {
  const { darkMode } = useContext(DarkModeContext);

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const apiUrl = process.env.REACT_APP_API_URL;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/orders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("Fetched hotels:", data.data);
        if (data.success) {
          const filteredData =
            userRole === 4
              ? data.data.filter(
                  (order) => order.serviceId.hotel === decodedToken.hotelId
                )
              : data.data;
          const formattedData = filteredData.map((order) => ({
            id: order._id,
            ...order,
          }));
          // setData(formattedData);
          setOrders(formattedData);
          setFilteredOrders(formattedData);
        } else {
          console.error("Failed to fetch Order", data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);

    // Lọc dữ liệu theo trạng thái
    if (status === "All") {
      setFilteredOrders(orders); // Hiển thị tất cả đơn hàng
    } else {
      const filtered = orders.filter((order) => order.status === status);
      setFilteredOrders(filtered);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const datas = await response.json();

      if (response.ok && datas.success) {
        setData(data.filter((item) => item.id !== id));
        alert("Order Deleted successfully!");
      } else {
        alert(datas.message || "Failed to delete the course.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("An error occurred while trying to delete the course.");
    }
  };

  const handleApproveCancel = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/orders/${id}/approve-cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Cập nhật trạng thái trong local state
        setData(
          data.map((item) =>
            item.id === id ? { ...item, status: "Cancelled" } : item
          )
        );
        alert("Đã hủy đơn hàng thành công!");
      } else {
        alert(result.message || "Không thể hủy đơn hàng");
      }
    } catch (error) {
      console.error("Error approving cancel:", error);
      alert("Có lỗi xảy ra khi xử lý yêu cầu hủy");
    }
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 120 },
    // { field: "serviceType", headerName: "ServiceType", width: 100 },
    { field: "hotelName", headerName: "Hotel", width: 200 },
    { field: "roomName", headerName: "Room", width: 200 },
    { field: "totalPrice", headerName: "Price Paid", width: 100 },
    { field: "originalPrice", headerName: "Base Price", width: 100 },
    { field: "commission", headerName: "Commission", width: 100 },
    { field: "netRevenue", headerName: "Net Revenue", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <div className={`cellWithStatus ${params.value}`}>{params.value}</div>
      ),
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        if (userRole !== 1 && userRole !== 2) {
          return <div style={{ color: "gray" }}>No Access</div>; // Hiển thị thông báo "No Access" nếu userRole = 2
        }
        return (
          <div className="cellAction">
            <Link
              to={`/admin/orders/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="addButton">Detail</div>
            </Link>

            {params.row.status === "Processing" && (
              <div
                className="viewButton"
                onClick={() => handleApproveCancel(params.row.id)}
              >
                Approve
              </div>
            )}

            {/* <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div> */}
          </div>
        );
      },
    },
  ];

  return (
    <div className="productable">
      <div className="filter">
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={selectedStatus}
          onChange={handleStatusChange}
        >
          <option value="All">All</option>
          <option value="Reserved">Reserved</option>
          <option value="Paid">Paid</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refunded">Refunded</option>
          <option value="Processing">Processing</option>
        </select>
      </div>
      <Paper className="productContainer">
        <DataGrid
          className="datagrid"
          rows={filteredOrders}
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

export default Ordertable;
