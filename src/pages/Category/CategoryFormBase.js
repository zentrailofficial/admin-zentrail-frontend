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
import ImageIcon from "@mui/icons-material/Image";
import travelPackageStyle from "../../styles/travelPackage";
import categoryStyle from "../../styles/category";
import commoncss from "../../styles/commoncss";
import addBlogStyle from "../../styles/blogcss";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CommonToolTip from "../../commen-component/CommonToolTip/CommonToolTip";
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
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <BookIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Add New Category
              </Typography>
              <CommonToolTip title=" Add New Category" />
            </Stack>
            <Paper elevation={3}
              sx={commoncss.cardlineargradient}>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 12, sm: 6, md: 12 }}
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
                  {/* <Grid
                    container
                    spacing={{ xs: 1, md: 3 }}
                    columns={{ xs: 12, sm: 12, md: 12 }}
                  >
                    <Grid size={{ xs: 12, md: 12 }}>
                      <Box sx={addBlogStyle.customBox1}>
                        <label>Meta Title</label>
                        <CommonToolTip title="Meta Title" />
                        <CommenTextField
                          name="meta.title"
                          label="Meta Title *"
                          required
                          maxLength={60}
                          messages={{
                            required: "Meta title is required",
                            maxLength: "Please do not exceed 60 characters",
                          }}
                        />
                      </Box>
                      <Box sx={addBlogStyle.customBox1}>
                      <label>Keywords</label>
                      <CommonToolTip title="Keywords" />
                      <CommenTextField name="meta.keywords" label="Keywords" />
                    </Box>
                    </Grid>
                  </Grid> */}
                   <Grid
                    container
                    spacing={{ xs: 1, md: 3 }}
                    columns={{ xs: 12, sm: 12, md: 12 }}
                  >
                    <Grid size={{ xs: 12, md: 6 }}>
                     <Box sx={addBlogStyle.customBox1}>
                        <label>Meta Title</label>
                        <CommonToolTip title="Meta Title" />
                        <CommenTextField
                          name="meta.title"
                          label="Meta Title *"
                          required
                          maxLength={60}
                          messages={{
                            required: "Meta title is required",
                            maxLength: "Please do not exceed 60 characters",
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={addBlogStyle.customBox1}>
                      <label>Keywords</label>
                      <CommonToolTip title="Keywords" />
                      <CommenTextField name="meta.keywords" label="Keywords" />
                    </Box>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={{ xs: 1, md: 3 }}
                    columns={{ xs: 12, sm: 12, md: 12 }}
                  >
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ gap: 1 }}>
                        <label>Meta Description *</label>
                        <CommenTextField
                          name="meta.description"
                          label="Meta Description *"
                          multiline
                          required
                          rows={3}
                          maxLength={160}
                          messages={{
                            required: "Meta description is required",
                            maxLength: "Please do not exceed 160 characters",
                          }}
                        /></Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <label> Description *</label>
                      <CommenTextField
                        name="description"
                        label="Description"
                        focused={isEdit}
                        multiline
                        rows={3}
                        required
                        minLength={30}
                        placeholder="Write blog content here..."
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={{ xs: 1, md: 3 }}
                    columns={{ xs: 12, sm: 12, md: 12 }}
                  >
                    <Grid size={{ xs: 12, md: 12 }}>
                       {/*  */}
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
                  <Grid size={{ xs: 12, sm:6, md: 12 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={1}
                    >
                      <ImageIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        URL & Featured Image
                      </Typography>
                      <CommonToolTip title=" URL & Featured Image" />
                    </Stack>

                    <ImageUpload
                      name="images"
                      label="Choose Blog Images"
                      multiple
                      altText
                      background="green"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* FAQ */}
          <Paper elevation={3}
            sx={commoncss.cardlineargradient}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 12, sm: 12, md: 12 }}
              sx={commoncss.faqBox}
            >
              <Grid size={{ xs: 12, md: 12 }}>
                <Stack sx={travelPackageStyle.customFaq}>
                  <Box sx={addBlogStyle.customBox2}>
                    <QuestionAnswerIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      FAQs
                    </Typography>
                    <CommonToolTip title="Keywords" />
                  </Box>
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
