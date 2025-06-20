import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../Style/lessontable.scss";

const TransactionTable = ({ filters }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          ...filters,
        }).toString();

        const res = await fetch(`${apiUrl}/transactions?${queryParams}`);
        const data = await res.json();

        if (data.success) {
          const hotelRows = (data.data.hotelTransactions || []).map((t) => ({
            id: t._id,
            type: "Hotel",
            user:
              t.user?.fullname ||
              t.user?.username ||
              t.user?.email ||
              "Unknown",
            item: t.hotel?.name || "Unknown Hotel",
            price: t.order?.totalPrice || 0,
            date: t.order?.createdAt
              ? new Date(t.order.createdAt).toLocaleString()
              : "N/A",
          }));

          const flightRows = (data.data.flightTransactions || []).map((t) => ({
            id: t._id,
            type: "Flight",
            user:
              t.user?.fullname ||
              t.user?.username ||
              t.user?.email ||
              "Unknown",
            item: t.flight?.flightNumber || "Unknown Flight",
            price: t.order?.totalPrice || 0,
            date: t.order?.createdAt
              ? new Date(t.order.createdAt).toLocaleString()
              : "N/A",
          }));

          setRows([...hotelRows, ...flightRows]);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [paginationModel, filters, apiUrl]);

  const columns = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "type", headerName: "Type", width: 100 },
    { field: "user", headerName: "User", width: 200 },
    { field: "item", headerName: "Item", width: 200 },
    { field: "price", headerName: "Price", width: 120 },
    { field: "date", headerName: "Date", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="viewButton"
              onClick={() =>
                navigate(
                  `/admin/transactions/${params.row.type.toLowerCase()}/${
                    params.row.id
                  }`
                )
              }
            >
              View
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Paper className="productable">
      <DataGrid
        className="datagrid"
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        loading={loading}
        disableRowSelectionOnClick
      />
    </Paper>
  );
};

export default TransactionTable;
