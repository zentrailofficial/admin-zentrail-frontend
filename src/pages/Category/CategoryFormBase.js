import React from "react";
import { Box, Paper, Grid, Stack, Typography } from "@mui/material";
import { FormProvider } from "react-hook-form";
import CommenTextField from "../../commen-component/TextField/TextField";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import BookIcon from "@mui/icons-material/Book";

const CategoryFormBase = ({
  methods,
  onSubmit,
  isEdit = false,
  defaultImage,
}) => {
  const {
    formState: { isSubmitting },
  } = methods;
  return (
    <FormProvider {...methods}>
      {/* <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
      > */}
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <BookIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Add New Category
              </Typography>
            </Stack>
            <Grid container spacing={3}>
              <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
                <CommenTextField
                  name="name"
                  focused={isEdit}
                  label="Category Name"
                  required
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
                <CommenTextField
                  name="metaTitle"
                  focused={isEdit}
                  label="Meta Title"
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
                <CommenTextField
                  name="metaDescription"
                  focused={isEdit}
                  label="Meta Description"
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
                <CommenTextField
                  name="description"
                  focused={isEdit}
                  label="Description"
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
                <ImageUpload
                  name="image"
                  focused={isEdit}
                  label="Image"
                  // defaultImage={defaultImage}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
                <CommonButton
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isEdit ? "Update Category" : "Add Category"}
                </CommonButton>
              </Grid>
            </Grid>
          </Paper>
        </form>
      {/* </Box> */}
    </FormProvider>
  );
};

export default CategoryFormBase;
