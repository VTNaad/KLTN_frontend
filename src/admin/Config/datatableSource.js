export const userColumns = [
  // { field: "id", headerName: "ID", width: 100 },
  {
    field: "user",
    headerName: "Username",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.avatar} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  { field: "email", headerName: "Email", width: 200 },
  {
    field: "phone",
    headerName: "Phone",
    type: "number",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "fullname",
    headerName: "Fullname",
    width: 200,
  },
  {
    field: "provider",
    headerName: "Provider",
    width: 100,
  },
  {
    field: "roleName",
    headerName: "Role",
    width: 100,
  },
];
