import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { useEffect, useState } from "react";
import commoncss from "../../styles/commoncss";
import CommonToolTip from "../../commen-component/CommonToolTip/CommonToolTip";
import CommenTextField from "../../commen-component/TextField/TextField";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../lib/api-client";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import { useAuth } from "../../context/AuthContext";

const EditRole = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState({
    add: false,
    edit: false,
    delete: false,
    view: false,
  });

  const methods = useForm();
  const { setValue, handleSubmit } = methods;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get(`/api/auth/users/${id}`);
        const data = res.data?.data;
        if (data) {
          setValue("name", data.name);
          setValue("email", data.email);
          setValue("role", data.role);
          setSelectedRole(data.role);
          setPermissions({
            add: data.canAdd,
            edit: data.canEdit,
            delete: data.canDelete,
            view: data.canView,
          });
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
        toast.error("Failed to fetch user details");
      }
    };
    if (id) fetchUser();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await apiClient.put(`/api/auth/users/${id}`, {
        name: data.name,
        email: data.email,
        role: selectedRole,
        panel: user.panel[0],
        canAdd: permissions.add,
        canEdit: permissions.edit,
        canDelete: permissions.delete,
        canView: permissions.view,
      });

      toast.success("Role updated successfully!");
      navigate("/role");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (event) => {
    setPermissions({
      ...permissions,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={commoncss.mainbox}>
          <Grid container sx={commoncss.grid1}>
            <Grid item xs={12} md={6} sx={commoncss.leftGrid}>
              <Paper elevation={3} sx={commoncss.cardlineargradient}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Edit Role
                  </Typography>
                </Stack>

                <Box sx={commoncss.metabox1}>
                  <Box sx={commoncss.labelbox}>
                    <label>Name</label>
                  </Box>
                  <Box sx={commoncss.fieldbox1}>
                    <CommenTextField
                      name="name"
                      label="Name *"
                      required
                      size="small"
                      focused={true}
                    />
                  </Box>
                </Box>

                <Box sx={commoncss.metabox1}>
                  <Box sx={commoncss.labelbox}>
                    <label>Email</label>
                  </Box>
                  <Box sx={commoncss.fieldbox1}>
                    <CommenTextField
                      name="email"
                      label="Email *"
                      required
                      size="small"
                      focused={true}
                      disabled={true}
                    />
                  </Box>
                </Box>

                <Box sx={commoncss.metabox1}>
                  <Box sx={commoncss.labelbox}>
                    <label>Role</label>
                  </Box>
                  <Box sx={commoncss.fieldbox1}>
                    <CommonDropdown
                      value={selectedRole} 
                      onChange={(e) => {
                        setSelectedRole(e.target.value);
                        setValue("role", e.target.value);
                      }}
                      options={[
                        { value: "manager", label: "Manager" },
                        { value: "executive", label: "Executive" },
                      ]}
                      name="role"
                      label="Role *"
                      size="small"
                    />
                  </Box>
                </Box>

                <Box sx={{ ...commoncss.metabox1, mt: 3 }}>
                  <Box sx={commoncss.labelbox}>
                    <label>Permissions</label>
                  </Box>
                  <Box sx={{ ...commoncss.fieldbox1, mt: 1 }}>
                    <FormGroup>
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

                <CommonButton
                  sx={{ borderRadius: 10, width: "100%" }}
                  loading={loading}
                  type="submit"
                >
                  Update
                </CommonButton>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </form>
    </FormProvider>
  );
};

export default EditRole;
