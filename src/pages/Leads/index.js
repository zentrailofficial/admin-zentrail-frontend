import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

import { CircularProgress, Box, Stack, Typography, Button } from "@mui/material";
import axios from "axios";
import { apiClient } from "../../lib/api-client";
import { handleDownloadCSV } from "../../utils/helperFunctions";
import commoncss from "../../styles/commoncss";
import CommonButton from "../../commen-component/CommenButton/CommenButton";

export default function InquiryTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: "fullName", headerName: "Full Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNo", headerName: "Phone No", flex: 1 },
    {
      field: "message", headerName: "Message", flex: 2,
      renderCell: (params) => (
        <span style={{ color: params.value ? "black" : "red" }}>
          {params.value ? params.value : "No message"}
        </span>
      )
    },
  ];

  useEffect(() => {
    const fetchInquiries = async () => {

      try {
        setLoading(true);
        const res = await apiClient.get("/api/inquiryform");
        setRows(res.data.data || []);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleExport = ()=>{
    handleDownloadCSV(columns ,rows , "Lead");
  }

  return (
    <Box sx={commoncss.listBox}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Leads</Typography>
        <Stack direction="row" justifyContent="space-between" mb={2} gap={2}>
          <CommonButton
            variant="contained"
            color="primary"
            onClick={handleExport}
          >
            export
          </CommonButton>
        </Stack>
      </Stack>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
      />
    </Box>
  );
}
