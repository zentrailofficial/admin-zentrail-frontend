import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import travelPackageStyle from "../../styles/travelPackage";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import ConfirmDelete from "../../commen-component/Modals/ConfirmDelete";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { apiClient } from "../../lib/api-client";
import commoncss from "../../styles/commoncss";
const ListSubCategory = () => {
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
      .get(`/api/subcategory`)
      .then((res) => {
        const tourList = res?.data || [];
        const formatted = tourList.map((val, index) => ({
          ...val,
          id: val._id, // Required for DataGrid
          sr: index + 1,
          name: val?.title,
          category: val?.categoryId?.name,
          createdAt: val?.createdAt?.split("T")[0],
        }));
        setListData(formatted);
      })
      .finally(() => setLoading(false));
  };
  const handleAddNewTour = () => {
    navigate("/addsubcategory");
  };
  const handleEdit = async (onEdit) => {
    navigate(`/editsubcategory/${onEdit._id}`);
  };
  const handleDelete = () => {
    setLoadingForDelete(true);
    try {
      apiClient.delete(`/api/subcategory/${IdtoDelete}`);
      setListData((prev) => prev.filter((row) => row.id !== IdtoDelete));
    } catch (error) {
      console.log(error.response?.data?.message);
    }finally{
      setIdtoDelete("")
      setLoadingForDelete(false)
      setDialogOpen(false)
    }
    
  };

  const columns = [
    { field: "sr", headerName: "Sr", width: 70 },
    { field: "name", headerName: "subcategory Name", flex: 2 },
    { field: "category", headerName: "category", flex: 2 },
    { field: "createdAt", headerName: "created at", flex: 2 },

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
  return (
    <Box sx={commoncss.listBox}>
      <Stack sx={travelPackageStyle.customBox2}>
        <Typography variant="h5" fontWeight={600}>
          Travel Package
        </Typography>
        <CommonButton onClick={handleAddNewTour} fullWidth={false}>
          Add SubCategory
        </CommonButton>
      </Stack>
      <DataGrid
        rows={listData}
        columns={columns}
        pagination
        pageSizeOptions={[10, 20, 50]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        loading={loading}
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

export default ListSubCategory;
