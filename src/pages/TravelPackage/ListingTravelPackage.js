import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import { useNavigate } from "react-router-dom";
import travelPackageStyle from "../../styles/travelPackage.js";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-client.js";
import ConfirmDelete from "../../commen-component/Modals/ConfirmDelete.jsx";
import { toast } from "react-toastify";
import commoncss from "../../styles/commoncss.js";
import { IoEye, IoEyeOff } from "react-icons/io5";
const ListingTravelPackage = () => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [IdtoDelete, setIdtoDelete] = useState("");
  const [loadingForDelete, setLoadingForDelete] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    apiClient
      .get(`/api/travel-packages/all`)
      .then((res) => {
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
          isActive: val?.isActive ? "Active" : "Inactive",
          status: val?.status,
          discount: val?.discount.amount
            ? `₹ ${val?.discount.amount}`
            : val?.discount?.percentage
              ? `${val?.discount?.percentage} %`
              : "No Discount",
        }));
        setListData(formatted);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    setLoadingForDelete(true);
    apiClient
      .delete(`/api/travel-packages/soft-delete/${IdtoDelete}`)
      .then(() => {
        fetchData();
        setLoadingForDelete(false);
        toast.success("Deleted successfully");
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
  const handleEdit = async (onEdit) => {
    navigate(`/edittour/${onEdit._id}`);
  };

  const columns = [
    { field: "sr", headerName: "Sr", width: 70 },
    { field: "name", headerName: "Package Name", flex: 1 },
    // { field: "duration", headerName: "Duration", flex: 1 },
    { field: "moodOfJourney", headerName: "Mood Of Journey", flex: 1 },
    { field: "type", headerName: "Type" },

    // { field: "season", headerName: "Season", flex: 1 },
    { field: "price", headerName: "Price" },
    {
      field: "discount",
      headerName: "Discount",
      renderCell: (params, i) => (
        <span
          style={{
            color: params.value == "No Discount" ? "red" : "green",
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
      field: "isActive",
      headerName: "Active",
      renderCell: (params) => (
        <span>
          {params.value !== "Active" ? <IoEyeOff color="red" fontSize={20} /> : <IoEye color="green" fontSize={20} />}
        </span>
      ),
    },
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
    <Box sx={commoncss.listBox}>
      <Stack sx={travelPackageStyle.customBox2}>
        <Typography variant="h5" fontWeight={600}>
          Travel Package
        </Typography>
        {/* <Box sx={travelPackageStyle.filterButton}>
          <CommonButton fullWidth={false}>Tour</CommonButton>
          <CommonButton fullWidth={false}>Trek</CommonButton>
        </Box> */}
        <CommonButton onClick={handleAddNewTour} fullWidth={false}>
          Add New Trip
        </CommonButton>
      </Stack>
      <DataGrid
        rows={listData}
        columns={columns}
        pagination
        pageSizeOptions={[10, 20, 50]}
        loading={loading}
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
        title="Delete Item?"
        message="This action is permanent. Do you want to continue?"
        loading={loadingForDelete}
      />
    </Box>
  );
};

export default ListingTravelPackage;
