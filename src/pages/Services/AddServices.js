import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CommenQuillEditor from "../../commen-component/TextEditor/TextEditor";
import CommenTextField from "../../commen-component/TextField/TextField";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import BookIcon from "@mui/icons-material/Book";
import SettingsIcon from "@mui/icons-material/Settings";
// import {  Delete as DeleteIcon } from "@mui/icons-material";

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
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import { apiClient } from "../../lib/api-client";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import { useNavigate } from "react-router-dom";

const AddServices = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [allPortfolioData, setAllPortfolioData] = useState([]);
  const [AllCategorieservicesOptions, setAllCategorieservicesOptions] =
    useState([]);
  const methods = useForm({
    defaultValues: {
      title: "",
      uid: "",
      description: "",
      serviceCategory: [],
      blogcategory: [],
      Portfolio: [],
      featuredImage: {
        url: "",
        altText: "",
      },
      meta: {
        title: "",
        description: "",
        keywords: "",
        canonicalUrl: "",
      },
      ogTags: {
        title: "",
        description: "",
        image: "",
      },
      status: "Draft",
      faq: [{ question: "", answer: "" }],
    },
  });
  const { setValue, control, handleSubmit } = methods;
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
      formData.append("description", data.description);
      formData.append("blogcategory", data.blogcategory);
      formData.append("serviceCategory", data.serviceCategory);
      formData.append("Portfolio", data.Portfolio);
      formData.append("status", data.status);
      if (data?.featuredImage?.length > 0) {
        formData.append("featuredImage", data.featuredImage[0].file);
        formData.append(
          "featuredImageAlt",
          data.featuredImage[0].altText || ""
        );
      }
      formData.append("meta[title]", data.meta?.title || "");
      formData.append("meta[description]", data.meta?.description || "");
      formData.append("meta[keywords]", data.meta?.keywords || "");
      formData.append("meta[canonicalUrl]", data.meta?.canonicalUrl || "");
      formData.append("ogTags[title]", data.ogTags?.title || "");
      formData.append("ogTags[description]", data.ogTags?.description || "");
      formData.append("ogTags[image]", data.ogTags?.image || "");
      formData.append("faq", JSON.stringify(data.faq));

      const response = await apiClient.post(
        "/api/service/servicepage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setLoading(false);
        navigate("/services");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      setLoading(false);
      alert("Failed to create blog");
    }
  };
  // setLoading(false);
  const fetchPortfolio = async () => {
    try {
      const res = await apiClient.get("/api/portfolio");
      console.log(res.data);
      const options = res.data.map((portfolio) => ({
        value: portfolio._id, // the actual ID for form submission
        label: portfolio.name || "", // a readable name for the dropdown
      }));

      setAllPortfolioData(options);
      // setAllPortfolioData(res.data);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching portfolio", error);
      // setLoading(false);
    }
  };
  const fetchCategory = async () => {
    try {
      const res = await apiClient.get("/api/category");
      const options = res.data.map((portfolio) => ({
        value: portfolio._id,
        label: portfolio.name || "",
      }));
      setCategoryOptions(options);
    } catch (error) {
      console.error("Error fetching portfolio", error);
    }
  };

  const fetchCategorieservices = async () => {
    const res = await apiClient.get("/api/service");
    console.log(res?.data?.services);
    const option = res?.data?.services.map((services) => ({
      value: services._id,
      label: services.name,
    }));
    setAllCategorieservicesOptions(option);
  };

  useEffect(() => {
    fetchPortfolio();
    fetchCategory();
    fetchCategorieservices();
  }, []);

  const textToSlug = (text) => {
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

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
                <Card elevation={3} sx={{ borderRadius: 3, mb: 2, padding: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <BookIcon color="primary" />
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Add New Service
                    </Typography>
                  </Stack>

                  <CommenTextField
                    name="title"
                    label="Service Title *"
                    required
                    size="small"
                    onChange={(val) => setValue("uid", textToSlug(val))}
                  />

                  <CommenTextField name="uid" label="uid" size="small" />
                  <CommenQuillEditor
                    name="description"
                    label="Description *"
                    required
                    minLength={30}
                    placeholder="Write blog content here..."
                  />
                </Card>

                <Card elevation={2} sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: { xs: 3, md: 2 } }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={3}
                    >
                      <CategoryIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Select Blog Category
                      </Typography>
                    </Stack>

                    <CommonDropdown
                      name="blogcategory"
                      label="Blog Category *"
                      options={categoryOptions}
                      required
                    />
                  </CardContent>
                </Card>
                <Card elevation={2} sx={{ borderRadius: 3, mt: 2 }}>
                  <CardContent sx={{ p: { xs: 3, md: 2 } }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={3}
                    >
                      <CategoryIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Service feature
                      </Typography>
                    </Stack>

                    <CommonDropdown
                      name="serviceCategory"
                      label="Service Category *"
                      multiple
                      options={AllCategorieservicesOptions}
                      required
                    />
                  </CardContent>
                </Card>

                <Card elevation={2} sx={{ borderRadius: 3, mt: 2 }}>
                  <CardContent sx={{ p: { xs: 3, md: 2 } }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={3}
                    >
                      <CategoryIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Gallery
                      </Typography>
                    </Stack>

                    <CommonDropdown
                      name="Portfolio"
                      label="Portfolio *"
                      options={categoryOptions}
                      required
                    />
                  </CardContent>
                </Card>
                <CommonDropdown
                  name="status"
                  label="Status"
                  required
                  options={[
                    { value: "Draft", label: "Draft" },
                    { value: "Published", label: "Published" },
                    { value: "Scheduled", label: "Scheduled" },
                  ]}
                />
              </Grid>
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
                <Card elevation={3} sx={{ borderRadius: 3, mb: 2, padding: 3 }}>
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

                  <Box sx={{ borderRadius: 3 }}>
                    <Typography fontWeight="600" textAlign="center">
                      Meta Tags
                    </Typography>
                    <CommenTextField
                      name="meta.title"
                      label="Meta Title *"
                      required
                    />
                    <CommenTextField
                      name="meta.description"
                      label="Meta Description *"
                      multiline
                      required
                      rows={3}
                    />
                    <CommenTextField name="meta.keywords" label="Keywords" />
                  </Box>

                  {/* OG Tags Accordion */}

                  <Box sx={{ borderRadius: 3 }}>
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
                <Card elevation={2} sx={{ borderRadius: 3 }}>
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
                      name="featuredImage"
                      label="Choose Service Images"
                      altText
                    />
                  </CardContent>
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
                          required
                        />
                        <CommenTextField
                          name={`faq.${index}.answer`}
                          label="Answer *"
                          required
                          multiline
                          rows={3}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>

                <Box mt={4}>
                  <CommonButton
                    sx={{
                      borderRadius: 10,
                      width: "100%",
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

export default AddServices;
