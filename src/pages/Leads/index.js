// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
// } from "@mui/material";

// import { CircularProgress, Box, Stack, Typography, Button } from "@mui/material";
// import axios from "axios";
// import { apiClient } from "../../lib/api-client";
// import { handleDownloadCSV } from "../../utils/helperFunctions";
// import commoncss from "../../styles/commoncss";
// import CommonButton from "../../commen-component/CommenButton/CommenButton";
// import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function InquiryTable() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   console.log(user)
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userlist, setUserlist] = useState([]);

//   const [open, setOpen] = useState(false);
//   const [selectedInquiry, setSelectedInquiry] = useState(null);
//   const [formData, setFormData] = useState({
//     status: "",
//     tag: "",
//     remarks: "",
//     source: "",
//   });

//   const handleEditClick = (inquiry) => {
//     if (!user.canEdit) {
//     alert("You don't have permission to edit");
//     return; // stop function here
//   }
//     setSelectedInquiry(inquiry);
//     setFormData({
//       status: inquiry.status || "",
//       tag: inquiry.tag || "",
//       remarks: inquiry.remarks || "",
//       source: inquiry.source || "",
//     });
//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async () => {
//     try {
//       const { data } = await apiClient.put(
//         `/api/inquiryform/${selectedInquiry._id}`,
//         formData
//       );

//       setRows((prev) =>
//         prev.map((row) =>
//           row._id === selectedInquiry._id ? data.data : row
//         )
//       );

//       setOpen(false);
//     } catch (err) {
//       console.error("Error updating inquiry:", err);
//     }
//   };


//   console.log("userlist", userlist)

//   const columns = [
//     { field: "fullName", headerName: "Full Name", flex: 1 },
//     { field: "email", headerName: "Email", flex: 1 },
//     { field: "phoneNo", headerName: "Phone No", flex: 1 },
//     { field: "source", headerName: "source", flex: 1 },
//     { field: "status", headerName: "status", flex: 1 },
//     { field: "tag", headerName: "tag", flex: 1 },
//     // {
//     //   field: "assigned_to", headerName: "assigned_to", flex: 1, renderCell: (params) => (
//     //     <select defaultValue={params.value || ""} >
//     //       {userlist?.map((item) => (
//     //         <option key={item.id} value={item.name}>{item.name}</option>
//     //       ))}
//     //     </select>
//     //   )
//     // },
//     {
//       field: "assigned_to",
//       headerName: "Assigned To",
//       flex: 1,
//       renderCell: (params) => (
//         // console.log(params?.value)
//         <select
//           disabled={user.role == "executive"}
//           defaultValue={params.value || ""}
//           onChange={async (e) => {
//             const selectedUser = e.target.value;
//             try {
//               await apiClient.put(`/api/inquiryform/${params.row._id}`, {
//                 assigned_to: selectedUser,
//               });
//               setRows((prev) =>
//                 prev.map((row) =>
//                   row._id === params.row._id
//                     ? { ...row, assigned_to: selectedUser }
//                     : row
//                 )
//               );
//             } catch (err) {
//               console.error("Error updating assignment", err);
//             }
//           }}
//         >
//           <option value="">Unassigned</option>
//           {userlist.map((user) => (
//             <option key={user.id} value={user.id}>
//               {user.name}
//             </option>
//           ))}
//         </select>
//       ),
//     },
//     {
//       field: "action",
//       headerName: "Action",
//       flex: 1,
//       sortable: false,
//       renderCell: (params) => (
//         <Button
//           variant="contained"
//           color="primary"
//           size="small"
//           onClick={() => handleEditClick(params.row)}
//         >
//           Edit
//         </Button>
//       ),
//     }

//   ];

//   useEffect(() => {
//     const fetchInquiries = async () => {

//       try {
//         setLoading(true);
//         const res = await apiClient.get("/api/inquiryform");
//         setRows(res.data.data || []);
//         console.log(res.data.data);
//       } catch (error) {
//         console.error("Error fetching inquiries:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInquiries();

//     // const fetchmanagers = async () => {
//     //   try {
//     //     const res = await apiClient.get("/api/userAuth/alluser");
//     //     const managers = res.data.data.filter((user) => user.role === "manager" || user.role === "executive");
//     //     setUserlist(managers.map((manager) => ({
//     //       id: manager._id,
//     //       name: manager.role.charAt(0) + " " + manager.name,
//     //     })));
//     //     console.log("Managers:", managers);
//     //   } catch (error) {
//     //     console.error("Error fetching managers:", error);
//     //   }
//     // }

//     const fetchManagers = async () => {
//       try {
//         const res = await apiClient.get("/api/userAuth/alluser");
//         const allUsers = res.data.data;

//         let filtered = [];

//         if (user.role === "admin") {
//           filtered = allUsers.filter(
//             (u) => u.role === "manager" || u.role === "executive"
//           );
//           setUserlist(
//           filtered.map((u) => ({
//             id: u._id,
//             name: `${u.role.charAt(0).toUpperCase()} ${u.name}`,
//             role: u.role,
//           }))
//         );
//         } else if (user.role === "manager") {
//           filtered = allUsers.filter((u) => u.role === "executive");
//           setUserlist(
//           filtered.map((u) => ({
//             id: u._id,
//             name: u.name,
//             role: u.role,
//           }))
//         );
//         }

//         // setUserlist(
//         //   filtered.map((u) => ({
//         //     id: u._id,
//         //     name: `${u.role.charAt(0).toUpperCase()} ${u.name}`,
//         //     role: u.role,
//         //   }))
//         // );
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchManagers()
//   }, []);

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="400px"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   const handleExport = () => {
//     handleDownloadCSV(columns, rows, "Lead");
//   }

//   return (
//     <Box sx={commoncss.listBox}>
//       <Stack direction="row" justifyContent="space-between" mb={2}>
//         <Typography variant="h5">Leads</Typography>
//         <Stack direction="row" justifyContent="space-between" mb={2} gap={2}>
//            <CommonButton
//             variant="contained"
//             color="primary"
//             onClick={()=>navigate('/addrole')}
//           >
//             Add role
//           </CommonButton>
//           <CommonButton
//             variant="contained"
//             color="primary"
//             onClick={handleExport}
//           >
//             export
//           </CommonButton>
//         </Stack>
//       </Stack>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         getRowId={(row) => row._id}
//         pageSize={5}
//         rowsPerPageOptions={[5, 10, 20]}
//         disableSelectionOnClick
//       />
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//         <DialogTitle>Edit Inquiry</DialogTitle>
//         <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
//           <Typography variant="body2">
//             <strong>Name:</strong> {selectedInquiry?.fullName}
//           </Typography>
//           <Typography variant="body2">
//             <strong>Email:</strong> {selectedInquiry?.email}
//           </Typography>
//           <Typography variant="body2">
//             <strong>Message:</strong> {selectedInquiry?.message}
//           </Typography>
//           <Typography variant="body2">
//             <strong>Phone:</strong> {selectedInquiry?.phoneNo}
//           </Typography>

//           <TextField
//             select
//             label="Source"
//             name="source"
//             value={formData.source}
//             onChange={handleChange}
//           >
//             <MenuItem value="meta">Meta</MenuItem>
//             <MenuItem value="google">Google</MenuItem>
//             <MenuItem value="website">Website</MenuItem>
//             <MenuItem value="whatsapp">WhatsApp</MenuItem>
//             <MenuItem value="manual">Manual</MenuItem>
//           </TextField>


//           <TextField
//             select
//             label="Status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//           >
//             <MenuItem value="New">New</MenuItem>
//             <MenuItem value="Contacted">Contacted</MenuItem>
//             <MenuItem value="In Progress">In Progress</MenuItem>
//             <MenuItem value="Converted">Converted</MenuItem>
//             <MenuItem value="Lost">Lost</MenuItem>
//           </TextField>

//           <TextField
//             select
//             label="Tag"
//             name="tag"
//             value={formData.tag}
//             onChange={handleChange}
//           >
//             <MenuItem value="Hot">Hot</MenuItem>
//             <MenuItem value="Interested">Interested</MenuItem>
//             <MenuItem value="Irrelevant">Irrelevant</MenuItem>
//             <MenuItem value="Converted">Converted</MenuItem>
//             <MenuItem value="Follow-up">Follow-up</MenuItem>
//           </TextField>


//           <TextField
//             label="Remarks"
//             name="remarks"
//             multiline
//             rows={3}
//             value={formData.remarks}
//             onChange={handleChange}
//           />
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button variant="contained" color="primary" onClick={handleUpdate}>
//             Update
//           </Button>
//         </DialogActions>
//       </Dialog>

//     </Box>

//   );
// }


import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { CircularProgress, Box, Stack, Typography, Button } from "@mui/material";
import { apiClient } from "../../lib/api-client";
import { handleDownloadCSV } from "../../utils/helperFunctions";
import commoncss from "../../styles/commoncss";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function InquiryTable() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userlist, setUserlist] = useState([]);

  const [filterType, setFilterType] = useState("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const [open, setOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    tag: "",
    remarks: "",
    source: "",
  });

  // 📦 Fetch data from API (with optional date filters)
  const fetchInquiries = async (startDate, endDate) => {
    try {
      setLoading(true);

      let url = "/api/inquiryform";
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const res = await apiClient.get(url);
      setRows(res.data.data || []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🕒 Handle date filter logic
const handleFilterChange = (type) => {
  setFilterType(type);

  const now = dayjs();
  let startDate, endDate;

  switch (type) {
    case "today":
      startDate = now.startOf("day").format("YYYY-MM-DD");
      endDate = now.endOf("day").format("YYYY-MM-DD");
      break;
    case "week":
      startDate = now.startOf("week").format("YYYY-MM-DD");
      endDate = now.endOf("week").format("YYYY-MM-DD");
      break;
    case "month":
      startDate = now.startOf("month").format("YYYY-MM-DD");
      endDate = now.endOf("month").format("YYYY-MM-DD");
      break;
    case "year":
      startDate = now.startOf("year").format("YYYY-MM-DD");
      endDate = now.endOf("year").format("YYYY-MM-DD");
      break;
    case "custom":
      return; // user will choose manually
    default:
      fetchInquiries();
      return;
  }

  fetchInquiries(startDate, endDate);
};


  const handleApplyCustom = () => {
    if (customRange.start && customRange.end) {
      fetchInquiries(customRange.start, customRange.end);
    } else {
      alert("Please select both start and end dates");
    }
  };

  // 🧑‍💼 Fetch userlist based on role
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await apiClient.get("/api/userAuth/alluser");
        const allUsers = res.data.data;

        let filtered = [];
        if (user.role === "admin") {
          filtered = allUsers.filter(
            (u) => u.role === "manager" || u.role === "executive"
          );
        } else if (user.role === "manager") {
          filtered = allUsers.filter((u) => u.role === "executive");
        }

        setUserlist(
          filtered.map((u) => ({
            id: u._id,
            name: u.name,
            role: u.role,
          }))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchManagers();
  }, []);

  // 🔥 Fetch all on mount
  useEffect(() => {
    fetchInquiries();
  }, []);

  // ✏️ Edit Inquiry
  const handleEditClick = (inquiry) => {
    if (!user.canEdit) {
      alert("You don't have permission to edit");
      return;
    }
    setSelectedInquiry(inquiry);
    setFormData({
      status: inquiry.status || "",
      tag: inquiry.tag || "",
      remarks: inquiry.remarks || "",
      source: inquiry.source || "",
    });
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const { data } = await apiClient.put(
        `/api/inquiryform/${selectedInquiry._id}`,
        formData
      );
      setRows((prev) =>
        prev.map((row) =>
          row._id === selectedInquiry._id ? data.data : row
        )
      );
      setOpen(false);
    } catch (err) {
      console.error("Error updating inquiry:", err);
    }
  };

  const columns = [
    { field: "fullName", headerName: "Full Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNo", headerName: "Phone No", flex: 1 },
    { field: "source", headerName: "Source", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "tag", headerName: "Tag", flex: 1 },
    {
      field: "assigned_to",
      headerName: "Assigned To",
      flex: 1,
      renderCell: (params) => (
        <select
          disabled={user.role === "executive"}
          defaultValue={params.value || ""}
          onChange={async (e) => {
            const selectedUser = e.target.value;
            try {
              await apiClient.put(`/api/inquiryform/${params.row._id}`, {
                assigned_to: selectedUser,
              });
              setRows((prev) =>
                prev.map((row) =>
                  row._id === params.row._id
                    ? { ...row, assigned_to: selectedUser }
                    : row
                )
              );
            } catch (err) {
              console.error("Error updating assignment", err);
            }
          }}
        >
          <option value="">Unassigned</option>
          {userlist?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleEditClick(params.row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  // if (loading) {
  //   return (
  //     <Box display="flex" justifyContent="center" alignItems="center" height="400px">
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  return (
    <Box sx={commoncss.listBox}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Leads</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">Select Filter</option>
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>

          {filterType === "custom" && (
            <>
              <input
                type="date"
                value={customRange.start}
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, start: e.target.value }))
                }
              />
              <input
                type="date"
                value={customRange.end}
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, end: e.target.value }))
                }
              />
              <Button variant="contained" onClick={handleApplyCustom}>
                Apply
              </Button>
            </>
          )}

          <CommonButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/addrole")}
          >
            Add Role
          </CommonButton>
          <CommonButton
            variant="contained"
            color="primary"
            onClick={() => handleDownloadCSV(columns, rows, "Lead")}
          >
            Export
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
        loading={loading}
      />

      {/* Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Inquiry</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Typography><strong>Name:</strong> {selectedInquiry?.fullName}</Typography>
          <Typography><strong>Email:</strong> {selectedInquiry?.email}</Typography>
          <Typography><strong>Phone:</strong> {selectedInquiry?.phoneNo}</Typography>

          <TextField
            select
            label="Source"
            name="source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          >
            <MenuItem value="meta">Meta</MenuItem>
            <MenuItem value="google">Google</MenuItem>
            <MenuItem value="website">Website</MenuItem>
            <MenuItem value="whatsapp">WhatsApp</MenuItem>
            <MenuItem value="manual">Manual</MenuItem>
          </TextField>

          <TextField
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Contacted">Contacted</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Converted">Converted</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </TextField>

          <TextField
            select
            label="Tag"
            name="tag"
            value={formData.tag}
            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
          >
            <MenuItem value="Hot">Hot</MenuItem>
            <MenuItem value="Interested">Interested</MenuItem>
            <MenuItem value="Irrelevant">Irrelevant</MenuItem>
            <MenuItem value="Converted">Converted</MenuItem>
            <MenuItem value="Follow-up">Follow-up</MenuItem>
          </TextField>

          <TextField
            label="Remarks"
            name="remarks"
            multiline
            rows={3}
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
