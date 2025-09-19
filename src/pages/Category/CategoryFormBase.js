import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Stack,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Controller, FormProvider, useFieldArray } from "react-hook-form";
import CommenTextField from "../../commen-component/TextField/TextField";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import BookIcon from "@mui/icons-material/Book";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import travelPackageStyle from "../../styles/travelPackage";
import categoryStyle from "../../styles/category";

const CategoryFormBase = ({
  methods,
  onSubmit,
  isEdit = false,
  defaultImage,
}) => {
  const {
    formState: { isSubmitting },
    control,
    watch,
    setValue,
  } = methods;

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: "faq",
  });
  const titleValue = watch("name");
  useEffect(() => {
    if (titleValue) {
      const slug = titleValue
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");

      setValue("slug", slug);
    }
  }, [titleValue, setValue]);

  return (
    <>
      <FormProvider {...methods}>
        {/* <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
      > */}

        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box>
            <Stack direction="row" spacing={2} mb={2}>
              <BookIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Add New Category
              </Typography>
            </Stack>
            <Paper elevation={3} sx={categoryStyle.paperShadow}>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 12, sm: 12, md: 12 }}
              >
                <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                  <Grid
                    container
                    spacing={{ xs: 1, md: 3 }}
                    columns={{ xs: 12, sm: 12, md: 12 }}
                  >
                    <Grid size={{ xs: 12, md: 6 }}>
                      <CommenTextField
                        name="name"
                        focused={isEdit}
                        label="Category Name"
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <CommenTextField
                        name="slug"
                        // focused={isEdit}
                        label="slug"
                        required
                        focused={watch("name")?.length}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={{ xs: 1, md: 3 }}
                    columns={{ xs: 12, sm: 12, md: 12 }}
                  >
                    <Grid size={{ xs: 12, md: 12 }}>
                      <CommenTextField
                        name="metaTitle"
                        focused={isEdit}
                        label="Meta Title"
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={{ xs: 1, md: 3 }}
                    columns={{ xs: 12, sm: 12, md: 12 }}
                  >
                    <Grid size={{ xs: 12, md: 6 }}>
                      <CommenTextField
                        name="metaDescription"
                        focused={isEdit}
                        label="Meta Description"
                        multiline
                        rows={3}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <CommenTextField
                        name="description"
                        focused={isEdit}
                        label="Description"
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={{ xs: 1, md: 3 }}
                    columns={{ xs: 12, sm: 12, md: 12 }}
                  >
                    <Grid size={{ xs: 12, md: 12 }}>
                      <CommenTextField
                        name="metakeywords"
                        focused={isEdit}
                        label="meta keywords"
                      />
                      <Box marginTop={1}>
                        <FormControlLabel
                          control={
                            <Controller
                              name="isblog"
                              control={methods.control}
                              render={({ field }) => (
                                <Switch {...field} checked={field.value} />
                              )}
                            />
                          }
                          label="category for blog"
                          sx={{ whiteSpace: "nowrap" }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <ImageUpload
                      name="image"
                      focused={isEdit}
                      label="Image"
                      // defaultImage={defaultImage}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* FAQ */}
          <Paper elevation={3} sx={categoryStyle.paperShadow}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 12, sm: 12, md: 12 }}
            >
              <Grid size={{ xs: 12, md: 12 }}>
                <Stack sx={travelPackageStyle.customFaq}>
                  <Typography variant="h6" fontWeight={600}>
                    FAQs
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => appendFaq({ question: "", answer: "" })}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>

                {faqFields.map((item, index) => (
                  <Box key={item.id} sx={travelPackageStyle.customFaqBox}>
                    <Stack sx={travelPackageStyle.customFaq}>
                      <Typography variant="subtitle1">
                        FAQ {index + 1}
                      </Typography>
                      {faqFields.length > 1 && (
                        <IconButton
                          color="error"
                          onClick={() => removeFaq(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>

                    <CommenTextField
                      name={`faq.${index}.question`}
                      label="Question *"
                    />
                    <CommenTextField
                      name={`faq.${index}.answer`}
                      label="Answer *"
                      multiline
                      rows={3}
                    />
                  </Box>
                ))}
              </Grid>
            </Grid>
            <Box sx={categoryStyle.buttonBox}>
              <CommonButton
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                fullWidth={false}
              >
                {isEdit ? "Update Category" : "Add Category"}
              </CommonButton>
            </Box>
          </Paper>
        </form>
        {/* </Box> */}
      </FormProvider>
    </>
  );
};

export default CategoryFormBase;
