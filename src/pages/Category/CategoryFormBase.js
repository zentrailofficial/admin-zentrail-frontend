import React from "react";
import { Box, Paper, Grid } from "@mui/material";
import { FormProvider } from "react-hook-form";
import CommenTextField from "../../commen-component/TextField/TextField";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import CommonButton from "../../commen-component/CommenButton/CommenButton";

const CategoryFormBase = ({ methods, onSubmit, isEdit = false, defaultImage }) => {
  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
              <CommenTextField name="name" focused={isEdit} label="Category Name" required />
            </Grid>
            <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
              <CommenTextField name="metaTitle" focused={isEdit} label="Meta Title" />
            </Grid>
            <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
              <CommenTextField name="metaDescription" focused={isEdit} label="Meta Description" />
            </Grid>
             <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
              <CommenTextField name="description" focused={isEdit} label="Description" multiline rows={4} />
            </Grid>
            <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
              <ImageUpload name="image" focused={isEdit} label="Image" defaultImage={defaultImage} />
            </Grid>
            <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
              <CommonButton type="submit">
                {isEdit ? "Update Category" : "Add Category"}
              </CommonButton>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </FormProvider>
  );
};

export default CategoryFormBase;
