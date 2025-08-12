import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
  Grid,
    IconButton,
} from "@mui/material";
import CommenTextField from "../../commen-component/TextField/TextField";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import BookIcon from "@mui/icons-material/Book";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Article as ArticleIcon,
  Image as ImageIcon,
  Tag as TagIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";

import { apiClient } from "../../lib/api-client";
import { v4 as uuidv4 } from "uuid";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CommenQuillEditor from "../../commen-component/TextEditor/TextEditor";
import { useNavigate } from "react-router-dom";
const AddBlogForm = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      title: "",
      author: "",
      description: "",
      category: "",
      images: [],
        faq: [{ question: "", answer: "" }],
    },
  });
     const { watch, setValue  , control} = methods;
  const titleValue = watch("title");
    const { fields, append, remove } = useFieldArray({
      control,
      name: "faq",
    });

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("uid", data.uid);
      formData.append("title", data.title);
      formData.append("authorName", data.author);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("tags", JSON.stringify(data.tags || []));
      formData.append("status", "Draft");

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
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      setLoading(false);
      alert("Failed to create blog");
    }
  };

  const handleAddMore = () => {
    alert("Add more clicked!");
  };

    useEffect(() => {
      if (titleValue) {
        const slug = titleValue
          .toLowerCase()
          .trim()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "_");
  
        setValue("uid", slug);
      }
    }, [titleValue, setValue]);

  useEffect(() => {
    apiClient.get("/api/category").then((data) => {
      console.log(data.data);

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
        <Box
          sx={{
            minHeight: "100vh",
            py: 0,
            px: 0,
            // bgcolor: "dark" ? "white" : "#F7F7F9",
            transition: "background 0.3s",
          }}
        >
          <Box maxWidth="xl" mx="auto">
            <Grid
              container
              spacing={2}
              sx={{
                flexDirection: { xs: "column", md: "row" },
                alignItems: "stretch",
              }}
            >
              {/* Left Section */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  width: { xs: "100%", md: "50%" },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* <Paper sx={{ borderRadius: 3, p: { xs: 2, md: 3 }, height: "100%" }}> */}

                <Card elevation={3} sx={{ borderRadius: 3, mb: 2, padding: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <BookIcon color="primary" />
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Add New Blog
                    </Typography>
                  </Stack>

                  <CommenTextField
                    name="title"
                    label="Blog Title *"
                    required
                    size="small"
                  />
                  <CommenTextField name="author" label="Author" size="small" />
                  <CommenTextField name="uid" label="uid" size="small" />
                  
                  <CommenQuillEditor
                    name="description"
                    label="Description *"
                    required
                    minLength={30}
                    placeholder="Write blog content here..."
                  />
                </Card>

                <Card elevation={2} sx={{ borderRadius: 3, mb: 2 }}>
                  <CardContent sx={{ p: { xs: 3, md: 2 } }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={3}
                    >
                      <CategoryIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Category & Tags
                      </Typography>
                    </Stack>

                    <CommonDropdown
                      name="category"
                      label="Category *"
                      options={categoryOptions}
                      required
                    />
                  </CardContent>
                </Card>

                <Card elevation={2} sx={{ borderRadius: 3, mb: 2 }}>
                  <CardContent sx={{ p: { xs: 3, md: 2 } }}>
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
                    </Stack>

                    <ImageUpload
                      name="images"
                      label="Choose Blog Images"
                      multiple
                      altText
                    />
                  </CardContent>
                </Card>

                {/* </Paper> */}
              </Grid>

              {/* Right Section */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  width: { xs: "100%", md: "45%" },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Card elevation={3} sx={{ borderRadius: 3, mb: 4, padding: 3 }}>
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
                  </Stack>
                  {/* Meta Tags Accordion */}

                  <Box sx={{ borderRadius: 3, padding: { xs: 3, md: 2 } }}>
                    <Typography fontWeight="600" textAlign="center">
                      Meta Tags
                    </Typography>
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
                    <CommenTextField name="meta.keywords" label="Keywords" />
                    <CommenTextField
                      name="meta.canonicalUrl"
                      label="Canonical URL"
                    />
                  </Box>
                  <Box
                    sx={{ borderRadius: 3, mb: 4, padding: { xs: 3, md: 2 } }}
                  >
                    <Typography fontWeight="600" textAlign="center">
                      Open Graph
                    </Typography>
                    <CommenTextField name="ogTags.title" label="OG Title" />
                    <CommenTextField
                      name="ogTags.description"
                      label="OG Description"
                      multiline
                      rows={3}
                    />
                    <CommenTextField name="ogTags.image" label="OG Image URL" />
                  </Box>
                  {/* </CardContent> */}

                </Card>

                    {/* FAQ Section */}
                                <Card elevation={2} sx={{ borderRadius: 3, mt: 2 }}>
                                  <CardContent>
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      justifyContent="space-between"
                                      mb={2}
                                    >
                                      <Typography variant="h6" fontWeight={600}>
                                        FAQs
                                      </Typography>
                                      <IconButton
                                        color="primary"
                                        onClick={() => append({ question: "", answer: "" })}
                                      >
                                        <AddIcon />
                                      </IconButton>
                                    </Stack>
                
                                    {fields.map((item, index) => (
                                      <Box
                                        key={item.id}
                                        sx={{
                                          border: "1px solid #ddd",
                                          borderRadius: 2,
                                          p: 2,
                                          mb: 2,
                                          background: "#fafafa",
                                        }}
                                      >
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
                                  </CardContent>
                                </Card>
                
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                sx={{
                  width: { xs: "100%", md: "50%" },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box>
                  <CommonButton
                    sx={{
                      borderRadius: 10,
                      width: { xs: "100%", md: "50%" },
                    }}
                    loading={loading}
                    type="submit"
                  >
                    Submit
                  </CommonButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
};

export default AddBlogForm;
