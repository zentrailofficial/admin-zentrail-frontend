import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import { apiClient } from "../../lib/api-client";
import { useNavigate } from "react-router-dom";
import CommenTextField from "../../commen-component/TextField/TextField";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import commoncss from "../../styles/commoncss";
import BookIcon from "@mui/icons-material/Book";
import CommonToolTip from "../../commen-component/CommonToolTip/CommonToolTip";
import CommenQuillEditor from "../../commen-component/TextEditor/TextEditor";
import ImageIcon from "@mui/icons-material/Image";

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
      <Box sx={commoncss.mainbox} >
        <Grid
          container
          sx={commoncss.grid1} >
          <Grid
            item
            xs={12}
            md={6}
            sx={commoncss.leftGrid}
          >
            <Paper elevation={3} sx={commoncss.cardlineargradient}>
              <Stack direction="row" justifyContent={"space-between"}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <BookIcon color="primary" />
                  <Typography variant="h5" gutterBottom>
                    Add Category Service
                  </Typography>
                  <CommonToolTip title="Add Category Service" />
                </Stack>
              </Stack>
              <FormProvider {...methods}>
                <Box
                  component="form"
                  onSubmit={methods.handleSubmit(onSubmit)}
                  noValidate
                >

                  <Box sx={commoncss.metabox1}>
                    <Box sx={commoncss.labelbox}> <label >Category Name  </label> </Box>
                    <Box sx={commoncss.tooltipbox}> <CommonToolTip title="70 characters only" /></Box>
                    <Box sx={commoncss.fieldbox1}>
                      <CommenTextField
                        name="name"
                        label="Category Name"
                        required
                      /> </Box>
                  </Box>
                  <label>Description *</label>
                  <CommenTextField
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                  />
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    mb={1}
                  >
                    <ImageIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Featured Image
                    </Typography>
                    <CommonToolTip title="Include at least one image with alt text" />
                  </Stack>
                  {/* <ImageUpload
                    name="image"
                    focused={isEdit}
                    label="Image"
                    altText
                  // defaultImage={defaultImage}
                  /> */}
                  <ImageUpload
                    name="image"
                    label="Image"
                    defaultImage={"defaultImage"}
                    multiple
                  />
                </Box>
              </FormProvider>
            </Paper>
            <CommonButton type="submit" loading={loading}>
              Add Category Service
            </CommonButton>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
};

export default CreateCategoryServices;
