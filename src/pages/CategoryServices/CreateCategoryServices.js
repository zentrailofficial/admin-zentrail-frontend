import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import { apiClient } from "../../lib/api-client";
import { useNavigate } from "react-router-dom";
import CommenTextField from "../../commen-component/TextField/TextField";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
const CreateCategoryServices = () => {
  const methods = useForm({
    defaultValues: {
      name: "",
      description: "",
      image: [],
    },
  });
  const { handleSubmit, reset } = methods;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      data.image.forEach((item, index) => {
        if (item.file) {
          formData.append("image", item.file);
        }
      });
      await apiClient.post("/api/service", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      reset();
      navigate("/categoryservices");
    } catch (err) {
      console.log("Error submitting portfolio:", err);
      //   alert("Failed to add portfolio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Box>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Add Category Service
          </Typography>

          <FormProvider {...methods}>
            <Box
              component="form"
              onSubmit={methods.handleSubmit(onSubmit)}
              noValidate
            >
                <Grid container spacing={3}>
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                    <CommenTextField
                      name="name"
                      label="Category Name"
                      required
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                    <ImageUpload
                      name="image"
                      label="Image"
                      defaultImage={"defaultImage"}
                      multiple
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                    <CommenTextField
                      name="description"
                      label="Description"
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                    <CommonButton type="submit" loading={loading}>
                      Add Category Service
                    </CommonButton>
                  </Grid>
                </Grid>
            </Box>
          </FormProvider>
        </Paper>
      </Box>
    </FormProvider>
  );
};

export default CreateCategoryServices;
