import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Box, Paper, Typography, Stack, Grid, IconButton } from "@mui/material";
import CommenTextField from "../../commen-component/TextField/TextField";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import BookIcon from "@mui/icons-material/Book";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { apiClient } from "../../lib/api-client";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CommonToolTip from "../../commen-component/CommonToolTip/CommonToolTip";
import commoncss from "../../styles/commoncss";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { isAllowedKey, sanitizeSlug } from "../../utils/helperFunctions";
import CustomCKEditor from "../../commen-component/TextEditor2/TextEditor2";
import dayjs from "dayjs";
const AddBlogForm = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const defaultScheduleTime = dayjs()
    .hour(12)
    .minute(0)
    .second(0)
    .millisecond(0);

  const methods = useForm({
    defaultValues: {
      type: "blog",
      title: "",
      author: "",
      description: "",
      category: "",
      images: [],
      Status: "Draft",
      scheduledDate: defaultScheduleTime,
      faq: [],
    },
  });
  const { watch, setValue, control  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "faq",
  });

  const onSubmit = async (data) => {
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("uid", data.uid);
      formData.append("type", data.type || "blog");
      formData.append("title", data.title);
      formData.append("authorName", data.author);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("tags", JSON.stringify(data.tags || []));
      formData.append("status", data.Status);

      if (data.images?.[0]?.file) {
        formData.append("featuredImage", data.images[0].file);
        formData.append("featuredImageAlt", data.images[0].altText || "");
      }

      formData.append("meta[title]", data.meta?.title || "");
      formData.append("meta[description]", data.meta?.description || "");
      formData.append("meta[keywords]", data.meta?.keywords || "");
      formData.append("meta[canonicalUrl]", data.meta?.canonicalUrl || "");

      formData.append("ogTags[title]", data.ogTags?.title || "");
      formData.append("ogTags[description]", data.ogTags?.description || "");
      formData.append("ogTags[image]", data.ogTags?.image || "");
      formData.append("faq", JSON.stringify(data.faq));
      const response = await apiClient.post("/api/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        console.log("Blog created successfully");
        setLoading(false);
        navigate("/blog");
        toast.success("Blog created successfully");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create blog");
    }
  };

  const titleValue = watch("title");
  useEffect(() => {
    if (titleValue) {
      const sanitizedSlug = sanitizeSlug(titleValue);
      setValue("uid", sanitizedSlug, { shouldValidate: true });
    }
  }, [titleValue, setValue]);

  useEffect(() => {
    apiClient.get("/api/category/blog-categories").then((data) => {
      const option = data.data.map((category) => ({
        value: category._id,
        label: category.name,
      }));
      setCategoryOptions(option);
    });
  }, []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box sx={commoncss.mainbox}>
          <Box maxWidth="xl" mx="auto">
            <Grid container sx={commoncss.grid1}>
              {/* Left Section */}

              <Grid item xs={12} md={6} sx={commoncss.leftGrid}>
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <BookIcon color="primary" />
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Add New Blog
                    </Typography>
                    <CommonToolTip title=" Add New Blog" />
                  </Stack>
                  <Box sx={commoncss.metabox1}>
                    <Box sx={commoncss.labelbox}>
                      <label>Blog/news </label>{" "}
                    </Box>
                    <Box sx={commoncss.tooltipbox}>
                      {" "}
                      <CommonToolTip title="select you want to create blog or news" />
                    </Box>
                    <Box sx={commoncss.fieldbox1}>
                      {" "}
                      <CommonDropdown
                        name="type"
                        label="type *"
                        options={[
                          { label: "Blog", value: "blog" },
                          { label: "News", value: "news" },
                        ]}
                        required
                      />
                    </Box>
                  </Box>
                  <Box sx={commoncss.metabox1}>
                    <Box sx={commoncss.labelbox}>
                      <label>Blog Title </label>{" "}
                    </Box>
                    <Box sx={commoncss.tooltipbox}>
                      {" "}
                      <CommonToolTip title="70 characters only" />
                    </Box>
                    <Box sx={commoncss.fieldbox1}>
                      {" "}
                      <CommenTextField
                        name="title"
                        label="Blog Title *"
                        required
                        size="small"
                        maxLength={90}
                      />
                    </Box>
                  </Box>
                  <Box sx={commoncss.metabox1}>
                    <Box sx={commoncss.labelbox}>
                      {" "}
                      <label>Author </label>{" "}
                    </Box>
                    <Box sx={commoncss.tooltipbox}>
                      {" "}
                      <CommonToolTip title="Author's Name" />
                    </Box>
                    <Box sx={commoncss.fieldbox1}>
                      {" "}
                      <CommenTextField
                        name="author"
                        label="Author"
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Box sx={commoncss.editorBox}>
                    <label>Description *</label>
                    <CustomCKEditor
                      name="description"
                      required
                      minLength={30}
                      placeholder="Write blog content here..."
                      height="500px"
                    />
                  </Box>
                  {/* <CommenQuillEditor
                    name="description"
                    label="Description *"
                    required
                    minLength={30}
                    placeholder="Write blog content here..."
                  /> */}
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <CategoryIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Category & Tags
                    </Typography>
                    <CommonToolTip title="Please select one" />
                  </Stack>
                  <CommonDropdown
                    name="category"
                    label="Category *"
                    options={categoryOptions}
                    required
                  />
                </Paper>
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <ImageIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      URL & Featured Image
                    </Typography>
                    <CommonToolTip title="Include at least one image with alt text" />
                  </Stack>
                  <ImageUpload
                    name="images"
                    label="Choose Blog Images"
                    multiple
                    altText
                    background="green"
                  />
                </Paper>
                {/* FAQ Section */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Box sx={commoncss.customBox2}>
                      <QuestionAnswerIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        FAQs
                      </Typography>
                      <CommonToolTip title="Questions and answers" />
                    </Box>
                    <IconButton
                      color="primary"
                      onClick={() => append({ question: "", answer: "" })}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>
                  <Box sx={commoncss.faqBox}>
                    {fields.map((item, index) => (
                      <Box key={item.id} sx={commoncss.faq}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography variant="subtitle1">
                            FAQ {index + 1}
                          </Typography>
                          {fields.length > 1 && (
                            <IconButton
                              color="error"
                              onClick={() => remove(index)}
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
                  </Box>
                </Paper>
              </Grid>
              {/* Right Section */}

              <Grid item xs={12} md={6} sx={commoncss.rightGrid}>
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  {/* elevation={1}
                sx={{
                  borderRadius: 3,
                  position: { md: "sticky" },
                  top: { md: 20 },
                  minHeight: { md: "calc(100vh - 40px)" },
                  height: "100%",
                  boxShadow: "dark" ? 8 : 2,
                }}
              > */}
                  {/* <CardContent sx={{ p: 1}}> */}
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <SettingsIcon color="primary" />
                    <Typography variant="h6" fontWeight="600">
                      SEO Settings
                    </Typography>
                    <CommonToolTip title="SEO Settings" />
                  </Stack>
                  {/* Meta Tags Accordion */}
                  <Box sx={commoncss.meta}>
                    <Box sx={commoncss.metabox1}>
                      <Box sx={commoncss.labelbox}>
                        {" "}
                        <label>uid </label>{" "}
                      </Box>
                      <Box sx={commoncss.tooltipbox}>
                        {" "}
                        <CommonToolTip title="URL slug" />{" "}
                      </Box>
                      <Box sx={commoncss.fieldbox}>
                        {" "}
                        <CommenTextField
                          name="uid"
                          label="uid"
                          size="small"
                          maxLength={90}
                          focused={watch("title")?.length}
                          onChange={(input) => {
                            const sanitizedSlug = sanitizeSlug(input);
                            setValue("uid", sanitizedSlug);
                          }}
                          onKeyDown={(e) => {
                            if (!isAllowedKey(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Box>
                    </Box>
                    <Box sx={commoncss.metabox1}>
                      <Box sx={commoncss.labelbox}>
                        {" "}
                        <label>Meta Title</label>{" "}
                      </Box>
                      <Box sx={commoncss.tooltipbox}>
                        {" "}
                        <CommonToolTip title="60 characters only" />
                      </Box>
                      <Box sx={commoncss.fieldbox}>
                        {" "}
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
                    </Box>
                    <Box sx={commoncss.metabox1}>
                      <Box sx={commoncss.labelbox}>
                        <label>Keywords</label>
                      </Box>
                      <Box sx={commoncss.tooltipbox}>
                        {" "}
                        <CommonToolTip title="SEO friendly keywords" />
                      </Box>
                      <Box sx={commoncss.fieldbox}>
                        {" "}
                        <CommenTextField
                          name="meta.keywords"
                          label="Keywords"
                        />
                      </Box>
                    </Box>
                    <Box sx={commoncss.metabox1}>
                      <Box sx={commoncss.labelbox}>
                        {" "}
                        <label>Meta Description </label>
                      </Box>
                      <Box sx={commoncss.tooltipbox}>
                        <CommonToolTip title="160 characters only" />
                      </Box>
                      <Box sx={commoncss.fieldbox}>
                        {" "}
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
                        />
                      </Box>
                    </Box>

                    {/* <CommenTextField
                      name="meta.canonicalUrl"
                      label="Canonical URL"
                    /> */}
                  </Box>
                </Paper>
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Box sx={commoncss.metabox1}>
                    <Box sx={commoncss.labelbox}>
                      {" "}
                      <label>Status</label>
                    </Box>
                    <Box sx={commoncss.tooltipbox}>
                      {" "}
                      <CommonToolTip title="After checking the blog and news publication, I was't able to draft it." />
                    </Box>
                    <Box sx={commoncss.fieldbox}>
                      {" "}
                      <CommonDropdown
                        name="Status"
                        label="status"
                        options={[
                          { label: "Draft", value: "Draft" },
                          { label: "Published", value: "Published" },
                        ]}
                      />

                    </Box>
                  </Box>
                </Paper>

                <CommonButton type="submit" loading={loading}>
                  Submit
                </CommonButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
};

export default AddBlogForm;
