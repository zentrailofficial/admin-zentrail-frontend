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
import ConfirmDelete from "../../commen-component/Modals/ConfirmDelete";

const ServicesList = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [IdtoDelete, setIdtoDelete] = useState("");
  const [loadingForDelete, setLoadingForDelete] = useState(false);

  const fetchCategories = async () => {
    const res = await apiClient.get("/api/service/servicepage/AllService");
    console.log(res?.data);
    const formatted = res?.data?.map((item, index) => ({
      id: item._id,
      sr: index + 1,
      name: item.title,
      description: item.description,
      metaTitle: item.meta.title,
      metaDescription: item.meta.description,
      image: item.featuredImage.url,
    }));
    setRows(formatted);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    setLoadingForDelete(true);
    console.log(IdtoDelete);
    try {
      const res = await apiClient.delete(`api/service/${IdtoDelete}`);
      console.log(res?.data);
      if (res?.data) {
        // setAllPortfolioData(
        //   allPortfolioData?.filter((val) => val?._id !== IdtoDelete)
        // );
        setLoadingForDelete(false);
        setDialogOpen(false);
        setIdtoDelete("");
      }
    } catch (error) {
      console.error("Error fetching categories", error);
      setLoadingForDelete(false);
      setDialogOpen(false);
      setIdtoDelete("");
    }
  };

  const handleEdit = async (onEdit) => {
    navigate(`/editcategoryservices/${onEdit.id}`);
  };

  const columns = [
    { field: "sr", headerName: "Sr", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1.5 },
    { field: "metaTitle", headerName: "Meta Title", flex: 1 },
    { field: "metaDescription", headerName: "Meta Description", flex: 1.5 },
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
    <Box sx={{ height: 600, width: "100%", p: 2 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Services List</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add services
        </Button>
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        disableRowSelectionOnClick
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
