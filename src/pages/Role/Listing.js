import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import { useNavigate } from "react-router-dom";
import travelPackageStyle from "../../styles/travelPackage.js";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { apiClient } from "../../lib/api-client.js";
import ConfirmDelete from "../../commen-component/Modals/ConfirmDelete.jsx";
import { toast } from "react-toastify";
import commoncss from "../../styles/commoncss.js";
import { useAuth } from "../../context/AuthContext.jsx";

const Listing = () => {
  const { user } = useAuth()
  console.log(user)
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [IdtoDelete, setIdtoDelete] = useState("");
  const [loadingForDelete, setLoadingForDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    apiClient
      .get(`/api/userAuth/alluser?role=${user?.role == "admin" ? "manager" : "executive"}`)
      .then((res) => {
        const users = res?.data?.data || [];
        const formatted = users.map((val, index) => ({
          id: val._id, // DataGrid expects "id" by default
          sr: index + 1,
          name: val?.name || "-",
          email: val?.email || "-",
          role: val?.role || "-",
          canAdd: val?.canAdd ? "✅" : "❌",
          canEdit: val?.canEdit ? "✅" : "❌",
          canDelete: val?.canDelete ? "✅" : "❌",
          canView: val?.canView ? "✅" : "❌",
          createdAt: new Date(val?.createdAt).toLocaleDateString(),
        }));
        setListData(formatted);
      })
      .catch((err) => console.error("Fetch users failed:", err))
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    setLoadingForDelete(true);
    apiClient
      .delete(`/api/userAuth/delete/${IdtoDelete}`)
      .then(() => {
        fetchData();
        toast.success("User deleted successfully");
        setDialogOpen(false);
        setIdtoDelete("");
      })
      .catch(() => {
        toast.error("Failed to delete user");
      })
      .finally(() => setLoadingForDelete(false));
  };

  const handleAddNew = () => {
    navigate("/addrole");
  };

  const handleEdit = (row) => {
    navigate(`/editrole/${row.id}`);
  };

  const columns = [
    { field: "sr", headerName: "Sr No", width: 80 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "canAdd", headerName: "Add", width: 90 },
    { field: "canEdit", headerName: "Edit", width: 90 },
    { field: "canDelete", headerName: "Delete", width: 90 },
    { field: "canView", headerName: "View", width: 90 },
    { field: "createdAt", headerName: "Created At", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEdit(params.row)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                setDialogOpen(true);
                setIdtoDelete(params.row.id);
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip> */}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={commoncss.listBox}>
      <Stack sx={travelPackageStyle.customBox2}>
        <Typography variant="h5" fontWeight={600}>
         Role Management
        </Typography>
        <CommonButton onClick={handleAddNew} fullWidth={false}>
          Add New Role
        </CommonButton>
      </Stack>

      <DataGrid
        rows={listData}
        columns={columns}
        pagination
        pageSizeOptions={[10, 20, 50]}
        loading={loading}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
      />

      <ConfirmDelete
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setIdtoDelete("");
        }}
        onConfirm={handleDelete}
        title="Delete User?"
        message="This action is permanent. Do you want to continue?"
        loading={loadingForDelete}
      />
    </Box>
  );
};

export default Listing;
