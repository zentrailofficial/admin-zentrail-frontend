import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { apiClient } from "../../lib/api-client";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import ConfirmDelete from "../../commen-component/Modals/ConfirmDelete";
import { toast } from "react-toastify";
import commoncss from "../../styles/commoncss";
const CategoryDataGrid = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [loadinglist, setloadinglist] = useState(false);
  const [deleteId, setdeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setloadinglist(true)
    const res = await apiClient.get("/api/category");
    const formatted = res.data.map((item, index) => ({
      id: item._id,
      sr: index + 1,
      name: item.name,
      isblog: item.isblog ? "for blog" : "for package",
      updatedAt: item.updatedAt.split("T")[0]
      // metaTitle: item.metaTitle,
      // metaDescription: item.metaDescription,
      // image: item.image,
    }));
    setRows(formatted);
    setloadinglist(false)
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    setOpen(true);
    setdeleteId(id);
  };

  const deleteHandeler = async () => {
    try {
      setloading(true);
      await apiClient.delete(`/api/category/${deleteId}`);
      setRows((prev) => prev.filter((row) => row.id !== deleteId));
      setOpen(false);
      toast.success("Category deleted successfully")
    } catch (error) {
      console.log(error?.response?.data?.message);
    } finally {
      setloading(false);
      setdeleteId(null)
    }
  };
  const handleEdit = async (onEdit) => {
    navigate(`/categoryedit/${onEdit.id}`);
  };

  const columns = [
    { field: "sr", headerName: "Sr", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "isblog", headerName: "isblog", flex: 1 },
    { field: "updatedAt", headerName: "updatedAt", flex: 1 },
    // { field: "metaTitle", headerName: "Meta Title", flex: 1 },
    // { field: "metaDescription", headerName: "Meta Description", flex: 1.5 },
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
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleCreate = () => {
    navigate("/categoryadd");
  };
  return (
    <>
      <Box sx={commoncss.listBox}>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="h5">Category</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <CommonButton
              variant="contained"
              onClick={() => navigate("/listsubcategory")}
            >
              List Sub Category
            </CommonButton>
            <CommonButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Create Category
            </CommonButton>
          </Box>
        </Stack>

        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          loading={loadinglist}
          pagination
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
        />
      </Box>
      <ConfirmDelete
        open={open}
        onClose={() => {
          setOpen(false)
          setdeleteId(null)
        }}
        onConfirm={deleteHandeler}
        title="Delete Confirmation"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
      />
    </>
  );
};

export default CategoryDataGrid;
