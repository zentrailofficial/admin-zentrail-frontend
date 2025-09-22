import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { apiClient } from "../../lib/api-client";

import { useNavigate } from "react-router-dom";
import ConfirmDelete from "../../commen-component/Modals/ConfirmDelete";
export default function BlogListGrid() {
  const [listData, setListData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [IdtoDelete, setIdtoDelete] = React.useState("");
  const [loadingForDelete, setLoadingForDelete] = React.useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    apiClient
      .get("/api/blogs")
      .then((res) => {
        const blogs = res.data.blogs || [];
        const formatted = blogs.map((blog, index) => ({
          ...blog,
          id: blog._id, // Required for DataGrid
          slNo: index + 1,
          category: blog?.category?.name || "No Category",
          createdAt: blog?.createdAt.split("T")[0],
        }));
        setListData(formatted);
      })
      .finally(() => setLoading(false));
  };
  console.log(listData);
  const handleEdit = (id) => {
    navigate(`/editblog/${id}`);
  };

  const handleDelete = () => {
    setLoadingForDelete(true);
    apiClient
      .delete(`/api/blogs/${IdtoDelete}`)
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

  const handleCreate = () => {
    navigate("/createblogs");
  };

  const columns = [
    { field: "slNo", headerName: "SL No.", width: 80 },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Category",
      width: 130,
    },
    {
      field: "authorName",
      headerName: "Author",
      width: 130,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        const status = params.value;
        let color = 'black';
        let backgroundColor = '#E0E0E0';

        if (status === 'Published') {
          color = 'green';
          backgroundColor = '#E9FFDB'; //  green
        } else if (status === 'Draft') {
          color = '#b77d62';
          backgroundColor = '#fff5cc'; // orange
        } else if (status === 'Scheduled') {
          color = '#617e9c';
          backgroundColor = '#cafdf5'; // blue
        }

        return (
          <span
            style={{
              color: color,
              backgroundColor: backgroundColor,
              fontWeight: 'bold',
              padding: '5px 15px',
              borderRadius: '5px',
            }}
          >
            {status}
          </span>
        );
      }
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      // valueGetter: (params) =>
      //   new Date(params?.row?.createdAt).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEdit(params.row._id)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            // onClick={() => handleDelete(params.row._id)}
            onClick={() => {
              setDialogOpen(true);
              setIdtoDelete(params.row._id);
            }}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", p: 2 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Blogs</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Create Blog
        </Button>
      </Stack>

      {loading ? (
        <Stack justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Stack>
      ) : (
        <DataGrid
          rows={listData}
          columns={columns}
          pageSizeOptions={[10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          checkboxSelection
          disableRowSelectionOnClick
        />
      )}
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
}
