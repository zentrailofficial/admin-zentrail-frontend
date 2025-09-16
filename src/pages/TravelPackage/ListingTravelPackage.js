import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import { useNavigate } from "react-router-dom";
import travelPackageStyle from "../../styles/travelPackage.js";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-client.js";
import ConfirmDelete from "../../commen-component/Modals/ConfirmDelete.jsx";
const ListingTravelPackage = () => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [IdtoDelete, setIdtoDelete] = useState("");
  const [loadingForDelete, setLoadingForDelete] = useState(false);

  console.log(listData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    apiClient
      .get(`/api/travel-packages/travel/getalltravelpackage?page=${1}&limit=${10}`)
      .then((res) => {
        console.log(res?.data?.data);
        const tourList = res?.data?.data || [];
        const formatted = tourList.map((val, index) => ({
          ...val,
          id: val._id, // Required for DataGrid
          sr: index + 1,
          name: val?.title,
          duration: val?.duration,
          price: val?.price,
          moodOfJourney: val?.moodOfJourney?.title,
          season: val?.season,
          weatherLocation: val?.weatherLocation,
        }));
        setListData(formatted);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    setLoadingForDelete(true);
    apiClient
      .delete(`/api/travel-packages/travel/permanent-delete/${IdtoDelete}`)
      .then(() => {
        fetchData();
        setLoadingForDelete(false);
        setDialogOpen(false);
        setIdtoDelete("");
      })
      .catch((err) => {
        alert("Failed to delete");
        setLoadingForDelete(false);
        setDialogOpen(false);
        setIdtoDelete("");
      });
  };

  const navigate = useNavigate();
  const handleAddNewTour = () => {
    navigate("/addtour");
  };
  const rows = [];

  const columns = [
    { field: "sr", headerName: "Sr", width: 70 },
    { field: "name", headerName: "Package Name", flex: 2 },
    { field: "duration", headerName: "Duration", flex: 1 },
    { field: "moodOfJourney", headerName: "Mood of journey", flex: 1 },
    { field: "season", headerName: "Season", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "weatherLocation", headerName: "Weather location", flex: 1 },
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
              // onClick={() =>  handleEdit(params.row)}
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
                setIdtoDelete(params.row._id);
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
    <Box sx={travelPackageStyle.customBox1}>
      <Stack sx={travelPackageStyle.customBox2}>
        <Typography variant="h5" fontWeight={600}>
          Travel Package
        </Typography>
        <CommonButton onClick={handleAddNewTour} fullWidth={false}>
          Add New Tour
        </CommonButton>
      </Stack>
      <DataGrid
        rows={listData}
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

export default ListingTravelPackage;
