import React, { useEffect, useState } from "react";
import {
  Box,
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
import ConfirmDelete from "../../commen-component/Modals/ConfirmDelete";
import { toast } from "react-toastify";
import commoncss from "../../styles/commoncss";
import CommonButton from "../../commen-component/CommenButton/CommenButton";

const ServicesList = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [IdtoDelete, setIdtoDelete] = useState("");
  const [loadingForDelete, setLoadingForDelete] = useState(false);

  const fetchCategories = async () => {
    const res = await apiClient.get("/api/service/servicepage/AllService");
    console.log(res);
    const formatted = res?.data?.map((item, index) => ({
      id: item._id,
      sr: index + 1,
      name: item.title,
      description: item.description,
      metaTitle: item.meta.title,
      metaDescription: item.meta.description,
      image: item.featuredImage.url,
      status: item.status,
    }));
    setRows(formatted);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    setLoadingForDelete(true);
    try {
      const res = await apiClient.delete(
        `api/service/deleteservice/${IdtoDelete}`
      );
      if (res?.data) {
        setLoadingForDelete(false);
        setDialogOpen(false);
        setIdtoDelete("");
      }
    } catch (error) {
      toast.error("Error fetching categories", error);
      setLoadingForDelete(false);
      setDialogOpen(false);
      setIdtoDelete("");
    }
  };

  const handleEdit = async (onEdit) => {
    navigate(`/editservices/${onEdit.id}`);
  };

  const columns = [
    { field: "sr", headerName: "Sr", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "metaTitle", headerName: "Meta Title", flex: 1 },
    { field: "metaDescription", headerName: "Meta Description", flex: 1.5 },
     {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span
          style={{
            color: params.value !== "Published" ? "orange" : "green",
            backgroundColor: params.value !== "Published" ? "#ffe1acff" : "#E9FFDB",
            fontWeight: "bold",
            padding: "5px 15px",
            borderRadius: "5px",
          }}
        >
          {params.value}
        </span>
      ),
    },
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
              // onClick={() => handleDelete(params.row.id)}
              onClick={() => {
                setDialogOpen(true);
                setIdtoDelete(params.row.id);
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleCreate = () => {
    navigate("/addservices");
  };
  return (
    <Box sx={commoncss.listBox}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Services List</Typography>
        <Stack direction="row" justifyContent="space-between" mb={2} gap={2}>
          <CommonButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Add services
          </CommonButton>
        </Stack>
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        pageSizeOptions={[5, 10, 20, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        disableRowSelectionOnClick
        autoHeight
      />
      <ConfirmDelete
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setIdtoDelete("");
        }}
        onConfirm={handleDelete}
        title="Delete Item?"
        message="This action is permanent. Do you want to continue?"
        loading={loadingForDelete}
      />
    </Box>
  );
};

export default ServicesList;
