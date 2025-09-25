import {
  Box,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CommenTextField from "../../commen-component/TextField/TextField";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { apiClient } from "../../lib/api-client";
import { useNavigate } from "react-router-dom";
import BookIcon from "@mui/icons-material/Book";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import travelPackageStyle from "../../styles/travelPackage";
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import categoryStyle from "../../styles/category";
import { toast } from "react-toastify";
import { isAllowedKey, sanitizeSlug } from "../../utils/helperFunctions";
import commoncss from "../../styles/commoncss";
import CommonToolTip from "../../commen-component/CommonToolTip/CommonToolTip";
import CommenQuillEditor from "../../commen-component/TextEditor/TextEditor";
import ImageIcon from "@mui/icons-material/Image";
import SettingsIcon from "@mui/icons-material/Settings";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const AddSubCategory = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      metaTitle: "",
      metaDescription: "",
      image: "",
      isblog: false,
      faq: [{ question: "", answer: "" }],
    },
  });
  const {
    formState: { isSubmitting },
    control,
    watch,
    setValue,
    isEdit = false,
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
  // useEffect(() => {
  //   if (titleValue) {
  //     const slug = titleValue
  //       .toLowerCase()
  //       .trim()
  //       .replace(/[^\w\s]/gi, "")
  //       .replace(/\s+/g, "-");

  //     setValue("slug", slug);
  //   }
  // }, [titleValue, setValue]);
  useEffect(() => {
    if (titleValue) {
      const slug = titleValue
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^\w\s]/gi, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      setValue("slug", slug, { shouldValidate: true });
    }
  }, [titleValue, setValue]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("api/category");
        const category = response.data;

        if (Array.isArray(category)) {
          const data = category.map((item) => ({
            value: item._id,
            label: item.name,
          }));
          setCategoriesList(data);
        }
      } catch (error) {
        toast.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    if (!data?.image) {
      return toast.error("Image is required")
    }
    if (!data?.image[0]?.altText) {
      return toast.error("altText of every images is required")
    }
    try {
      const formData = new FormData();
      formData.append("categoryId", data.category);
      formData.append("title", data?.name);
      formData.append("uid", data.slug);
      formData.append("description", data?.description);
      formData.append("metaTitle", data?.metaTitle);
      formData.append("metaDescription", data?.metaDescription);
      formData.append("metaKeyword", data?.metakeywords);
      formData.append("faq", JSON.stringify(data?.faq));
      // formData.append("image", data?.image);
      // if (data.image[0]?.file) {
      formData.append("image", data?.image[0]?.file);
      formData.append("imageAlt", data?.image[0]?.altText || "");
      // }
      await apiClient.post("/api/subcategory", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Create Successful");
      methods.reset();
      navigate("/listsubcategory");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Box>
      <FormProvider {...methods}>
        {/* <Box
                component="form"
                onSubmit={methods.handleSubmit(onSubmit)}
                noValidate
              > */}

        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* <Paper sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <BookIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Add New SubCategory
              </Typography>
            </Stack>
            <Grid container spacing={3}>
              <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant="h6" fontWeight={600}>
                  Type of Categories
                </Typography>

                <CommonDropdown
                  name="category"
                  label="Select of Category *"
                  options={categoriesList}
                  // onChangeValues={handleMoodOfJourneyChange}
                  required
                />

                <CommenTextField
                  name="name"
                  focused={isEdit}
                  label="SubCategory Name"
                  required
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
                <CommenTextField
                  name="slug"
                  // focused={isEdit}
                  label="slug"
                  required
                  focused={watch("name")?.length}
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
                <CommenTextField name="metakeywords" label="meta keywords" />
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
              <Paper elevation={3} sx={travelPackageStyle.addTravel}>
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
              </Paper>
            </Grid>
          </Paper> */}

          <>
            <Box sx={commoncss.mainbox} >
              <Box maxWidth="xl" mx="auto" >
                <Grid container
                  sx={commoncss.grid1} >
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={commoncss.leftGrid}
                  >
                    <Paper elevation={3}
                      sx={commoncss.cardlineargradient}>

                      <Stack direction="row" alignItems="center" spacing={2}>
                        <BookIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                          Add New SubCategory
                        </Typography>
                        <CommonToolTip title=" New SubCategory" />
                      </Stack>
                      <Box sx={commoncss.meta}>
                        <Box sx={commoncss.metabox1}>
                          <Box sx={commoncss.labelbox}> <label >SubCategory Name</label></Box>
                          <Box sx={commoncss.tooltipbox}> <CommonToolTip title=" New SubCategory" /></Box>
                          <Box sx={commoncss.fieldbox1}> <CommenTextField
                            name="name"
                            focused={isEdit}
                            label="SubCategory Name"
                            required
                          />
                          </Box>
                        </Box>
                        <Box sx={commoncss.metabox1}>
                          <Box sx={commoncss.labelbox}> <label >Select Category *</label></Box>
                          <Box sx={commoncss.tooltipbox}><CommonToolTip title=" New SubCategory" /></Box>
                          <Box sx={commoncss.fieldbox1}> <CommonDropdown
                            name="category"
                            label="Select Category *"
                            options={categoriesList}
                            // onChangeValues={handleMoodOfJourneyChange}
                            // focused={false}
                            required
                          /></Box>
                        </Box>
                      </Box>
                      <CommenQuillEditor
                        name="description"
                        required minLength={30}
                        label="Category description" />
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
                        <CommonToolTip title="Alt text required" />
                      </Stack>
                      <ImageUpload
                        name="image"
                        focused={isEdit}
                        label="Image"
                        altText
                      // defaultImage={defaultImage}
                      />
                    </Paper>
                  </Grid>
                    <Grid
                  item
                  xs={12}
                  md={6}
                  sx={commoncss.rightGrid}
                >
                  <Paper elevation={3}
                    sx={commoncss.cardlineargradient}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                      <SettingsIcon color="primary" />
                      <Typography variant="h6" fontWeight="600">
                        SEO Settings
                      </Typography>
                      <CommonToolTip title=" SEO Settings" />
                    </Stack>
                    <Box sx={commoncss.meta}>
                      <Box sx={commoncss.metabox1}>
                        <Box sx={commoncss.labelbox}> <label>Meta Title</label></Box>
                        <Box sx={commoncss.tooltipbox}>
                          <CommonToolTip title="60 characters only" /></Box>
                        <Box sx={commoncss.fieldbox}>
                      
                          <CommenTextField
                          name="metaTitle"
                          focused={isEdit}
                          label="Meta Title"
                          required
                        />
                      </Box>
                        </Box>
                      <Box sx={commoncss.metabox1}>
                        <Box sx={commoncss.labelbox}><label>Keywords</label></Box>
                        <Box sx={commoncss.tooltipbox}>  <CommonToolTip title="Keywords" /></Box>
                        <Box sx={commoncss.fieldbox}>
                           <CommenTextField
                          name="metaKeyword"
                          focused={isEdit}
                          label="meta keywords"
                          required={!watch("isblog")}
                        /></Box>
                      </Box>
                      <Box sx={commoncss.metabox1}>
                        <Box sx={commoncss.labelbox}>
                          <label>Meta Description</label>
                        </Box>
                        <Box sx={commoncss.tooltipbox}>
                          <CommonToolTip title="160 characters only" />
                        </Box>

                        <Box sx={commoncss.fieldbox}>
                           <CommenTextField
                          name="metaDescription"
                          focused={isEdit}
                          label="Meta Description"
                          multiline
                          rows={4}
                          required
                        />
                        </Box>
                      </Box>
                      <Box sx={commoncss.metabox1}>
                        <Box sx={commoncss.labelbox}>
                          <label>Slug</label>
                        </Box>
                        <Box sx={commoncss.tooltipbox}>
                          <CommonToolTip title="Slug" />
                        </Box>
                        <Box sx={commoncss.fieldbox}>
                           <CommenTextField
                          name="slug"
                          label="slug"
                          required
                          focused={watch("name")?.length}
                          onChange={(input) => {
                            const sanitizedSlug = sanitizeSlug(input);
                            setValue("slug", sanitizedSlug);
                          }}
                          onKeyDown={(e) => {
                            if (!isAllowedKey(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                 <Paper elevation={3}
                    sx={commoncss.cardlineargradient}>

                    <Stack sx={travelPackageStyle.customFaq}>
                      <Box sx={commoncss.customBox2}>
                        <QuestionAnswerIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                          FAQs
                        </Typography>
                        <CommonToolTip title="Questions and answers" />
                      </Box>
                      <IconButton
                        color="primary"
                        onClick={() => appendFaq({ question: "", answer: "" })}
                      >
                        <AddIcon />
                      </IconButton>
                    </Stack>
                    <Box sx={commoncss.faqBox}>
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
                            required={!watch("isblog")}
                          />
                          <CommenTextField
                            name={`faq.${index}.answer`}
                            label="Answer *"
                            multiline
                            rows={3}
                            required={!watch("isblog")}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                  <CommonButton
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    fullWidth={false}
                  >
                    {isEdit ? "Update Category" : "Add Sub Category"}
                  </CommonButton>
             
                  </Grid>
                </Grid>
              </Box>
              {/* <Stack direction="row" spacing={2} mb={2}>
                <BookIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Add New SubCategory
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

                      <Grid size={{ xs: 12, md: 4 }}>
                        <CommonDropdown
                          name="category"
                          label="Select of Category *"
                          options={categoriesList}
                          // onChangeValues={handleMoodOfJourneyChange}
                          // focused={false}
                          required
                        />

                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }}>
                        <CommenTextField
                          name="name"
                          focused={isEdit}
                          label="SubCategory Name"
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <CommenTextField
                          name="slug"
                          label="slug"
                          required
                          focused={watch("name")?.length}
                          onChange={(input) => {
                            const sanitizedSlug = sanitizeSlug(input);
                            setValue("slug", sanitizedSlug);
                          }}
                          onKeyDown={(e) => {
                            if (!isAllowedKey(e.key)) {
                              e.preventDefault();
                            }
                          }}
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
                          required
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
                          rows={4}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <CommenTextField
                          name="description"
                          focused={isEdit}
                          label="Description"
                          multiline
                          rows={4}
                          required
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
                          required
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Grid size={{ xs: 12, md: 12 }}>
                      <ImageUpload
                        name="image"
                        focused={isEdit}
                        label="Image"
                        altText
                      // defaultImage={defaultImage}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>

              {/* FAQ */}
              {/* <Paper elevation={3} sx={categoryStyle.paperShadow}>
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
                          required
                        />
                        <CommenTextField
                          name={`faq.${index}.answer`}
                          label="Answer *"
                          multiline
                          rows={3}
                          required
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
                    {isEdit ? "Update Category" : "Add Sub Category"}
                  </CommonButton>
                </Box>
              </Paper> */}
            </Box>
          </>
        </form>
        {/* </Box> */}
      </FormProvider>
    </Box>
  );
};

export default AddSubCategory;
