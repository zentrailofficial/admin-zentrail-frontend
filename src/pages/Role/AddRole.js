import { Box, Grid, Paper, Stack, Typography, FormControlLabel, Checkbox, FormGroup, InputAdornment, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import commoncss from "../../styles/commoncss";
import CommonToolTip from "../../commen-component/CommonToolTip/CommonToolTip";
import CommenTextField from "../../commen-component/TextField/TextField";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../lib/api-client";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import { useAuth } from "../../context/AuthContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AddRole = ({ defaultValues }) => {
  const { user } = useAuth()
  console.log(user?.panel[0])
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState({
    add: false,
    edit: false,
    delete: false,
    view: false,
  });
  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;
  const handlePermissionChange = (event) => {
    setPermissions({
      ...permissions,
      [event.target.name]: event.target.checked,
    });
  };
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await apiClient.post("/api/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: user?.role == "admin" ? "manager" : "executive",
        panel: user.panel[0],
        canAdd: permissions.add,
        canEdit: permissions.edit,
        canDelete: permissions.delete,
        canView: permissions.view,
        createdBy: user?.id
      });

      navigate("/role");
      toast.success("Role created successfully");
    } catch (error) {
      setLoading(false);
      toast.error("Failed to save service");
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={commoncss.mainbox}>
          <Grid container sx={commoncss.grid1}>
            {/* Left Section */}
            <Grid item xs={12} md={6} sx={commoncss.leftGrid}>
              <Paper elevation={3} sx={commoncss.cardlineargradient}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  {/* <BookIcon color="primary" /> */}
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Add {user?.role == "admin" ? "Manager" : "Executive"}
                  </Typography>
                </Stack>
                <Box sx={commoncss.metabox1}>
                  <Box sx={commoncss.labelbox}>
                    <label>{`Name`} </label>{" "}
                  </Box>
                  <Box sx={commoncss.tooltipbox}>
                    {" "}
                    <CommonToolTip title="70 characters only" />
                  </Box>
                  <Box sx={commoncss.fieldbox1}>
                    <CommenTextField
                      name="name"
                      label="Name *"
                      required
                      size="small"
                    />
                  </Box>
                </Box>
                <Box sx={commoncss.metabox1}>
                  <Box sx={commoncss.labelbox}>
                    <label>Email</label>{" "}
                  </Box>
                  <Box sx={commoncss.tooltipbox}>
                    {" "}
                    <CommonToolTip title="70 characters only" />
                  </Box>
                  <Box sx={commoncss.fieldbox1}>
                    {" "}
                    <CommenTextField
                      name="email"
                      label="Email *"
                      required
                      size="small"
                    />
                  </Box>
                </Box>
                <Box sx={commoncss.metabox1}>
                  <Box sx={commoncss.labelbox}>
                    <label>{`Password`}</label>{" "}
                  </Box>
                  <Box sx={commoncss.tooltipbox}>
                    {" "}
                    <CommonToolTip title="70 characters only" />
                  </Box>
                  <Box sx={commoncss.fieldbox1}>
                    {" "}
                    {/* <CommenTextField name="password" label="Password *" required size="small" /> */}
                    <CommenTextField
                      name="password"
                      label="Password *"
                      required
                      size="small"
                      type={showPassword ? "text" : "password"} // text/password
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>
                {/* <Box sx={commoncss.metabox1}>
                  <Box sx={commoncss.labelbox}>
                    <label>Role</label>{" "}
                  </Box>
                  <Box sx={commoncss.tooltipbox}>
                    {" "}
                    <CommonToolTip title="70 characters only" />
                  </Box>
                  <Box sx={commoncss.fieldbox1}>
                    {" "}
                    <CommonDropdown
                      options={[
                        { value: "manager", label: "Manager" },
                        { value: "executive", label: "Executive" },
                      ]}
                      name="role"
                      label="Role *"
                      size="small"
                    />
                  </Box>
                </Box> */}
                <Box sx={{ ...commoncss.metabox1 }}>
                  <Box sx={commoncss.labelbox}>
                    <label>{`Permissions`}</label>
                  </Box>
                  <Box sx={commoncss.tooltipbox}>
                    <CommonToolTip title="Select role permissions" />
                  </Box>
                  <Box sx={{ ...commoncss.fieldbox1, mt: 1 }}>
                    <FormGroup sx={{ flexDirection: "row", justifyContent: "center" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={permissions.add}
                            onChange={handlePermissionChange}
                            name="add"
                            color="primary"
                          />
                        }
                        label="Add"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={permissions.edit}
                            onChange={handlePermissionChange}
                            name="edit"
                            color="primary"
                          />
                        }
                        label="Edit"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={permissions.delete}
                            onChange={handlePermissionChange}
                            name="delete"
                            color="primary"
                          />
                        }
                        label="Delete"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={permissions.view}
                            onChange={handlePermissionChange}
                            name="view"
                            color="primary"
                          />
                        }
                        label="View"
                      />
                    </FormGroup>
                  </Box>
                </Box>
              </Paper>
              <CommonButton
                sx={{
                  borderRadius: 10,
                  width: "100%",
                }}
                loading={loading}
                type="submit"
              >
                {` Submit`}
              </CommonButton>
            </Grid>
          </Grid>
        </Box>
      </form>
    </FormProvider>
  );
};

export default AddRole;
