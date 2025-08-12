import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import CommenTextField from "../../commen-component/TextField/TextField";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Tag as TagIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import { apiClient } from "../../lib/api-client";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import CommenQuillEditor from "../../commen-component/TextEditor/TextEditor";

const EditBlog = () => {
  const { id } = useParams(); // assuming route = /edit/:id
  const methods = useForm({
    defaultValues: {
      title: "",
      author: "",
      content: "",
      description: "",
      images: [],
      meta: {},
      ogTags: {},
    },
  });
  const { reset, handleSubmit, getValues, formState } = methods;

  const [loading, setLoading] = useState(true);

  console.log(reset, formState);
  const categoryOptions = [
    { value: "tech", label: "Tech" },
    { value: "health", label: "Health" },
  ];
  console.log(id);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(`/api/blogs/${id}`);
        const blog = res.data.blog;
        console.log(blog, "Ddd");
        const mapped = {
          title: blog.title,
          author: blog.authorName,
          description: blog.description,
          category: blog.category,
          images: blog.featuredImage?.url
            ? [
                {
                  url: blog.featuredImage.url,
                  altText: blog.featuredImage.altText,
                },
              ]
            : [],
          meta: blog.meta,
          ogTags: blog.ogTags,
        };
        console.log(mapped);
        reset(mapped);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("authorName", data.author);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("tags", JSON.stringify(data.tags || []));
      formData.append("status", "Draft");

      // Check if a new image is uploaded
      const image = data.images?.[0];
      if (image?.file) {
        formData.append("featuredImage", image.file);
        formData.append("featuredImageAlt", image.altText || "");
      } else if (image?.url) {
        formData.append("featuredImageUrl", image.url);
        formData.append("featuredImageAlt", image.altText || "");
      }

      // Meta
      formData.append("meta[title]", data.meta?.title || "");
      formData.append("meta[description]", data.meta?.description || "");
      formData.append("meta[keywords]", data.meta?.keywords || "");
      formData.append("meta[canonicalUrl]", data.meta?.canonicalUrl || "");

      // OG Tags
      formData.append("ogTags[title]", data.ogTags?.title || "");
      formData.append("ogTags[description]", data.ogTags?.description || "");
      formData.append("ogTags[image]", data.ogTags?.image || "");

      const res = await apiClient.put(`/api/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        alert("Blog updated successfully");
      }
    } catch (error) {
      console.error("Failed to update blog", error);
      alert("Failed to update");
    }
  };

  const handleAddMore = () => {
    alert("Add more clicked!");
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          minHeight: "100vh",
          py: 4,
          px: 2,
          // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box maxWidth="600px" mx="auto">
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Add New Blog
            </Typography>

            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <CommenTextField name="title" label="Blog Title *" required />
              <CommenTextField name="author" label="Author" required />
              <CommenQuillEditor
                name="description"
                label="Description *"
                required
                minLength={30}
                placeholder="Write blog content here..."
              />

              {/* Category and Tags */}
              <Card elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
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
                    showAddMore
                    onAddMoreClick={handleAddMore}
                  />
                </CardContent>
              </Card>

              {/* URL and Image */}
              <Card elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <ImageIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      URL & Featured Image
                    </Typography>
                  </Stack>

                  <Stack spacing={3}>
                    <ImageUpload
                      name="images"
                      label="Choose Blog Images"
                      multiple
                      altText
                    />
                  </Stack>
                </CardContent>
              </Card>

              <Grid item xs={12} lg={4}>
                <Stack spacing={3}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "sticky",
                      top: 20,
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        mb={3}
                      >
                        <SettingsIcon color="primary" />
                        <Typography variant="h6" fontWeight="600">
                          SEO Settings
                        </Typography>
                      </Stack>

                      {/* Meta Tags Accordion */}
                      <Accordion
                        elevation={0}
                        sx={{ "&:before": { display: "none" } }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ px: 0 }}
                        >
                          <Typography fontWeight="600">Meta Tags</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 0 }}>
                          <Stack spacing={2}>
                            <CommenTextField
                              name="meta.title"
                              label="Meta Title *"
                              required={true}
                            />
                            <CommenTextField
                              name="meta.description"
                              label="Meta Description *"
                              multiline
                              rows={3}
                            />
                            <CommenTextField
                              name="meta.keywords"
                              label="Keywords"
                            />
                            <CommenTextField
                              name="meta.canonicalUrl"
                              label="Canonical URL"
                            />
                          </Stack>
                        </AccordionDetails>
                      </Accordion>

                      {/* OG Tags Accordion */}
                      <Accordion
                        elevation={0}
                        sx={{ "&:before": { display: "none" } }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ px: 0 }}
                        >
                          <Typography fontWeight="600">Open Graph</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 0 }}>
                          <Stack spacing={2}>
                            <CommenTextField
                              name="ogTags.title"
                              label="OG Title"
                            />
                            <CommenTextField
                              name="ogTags.description"
                              label="OG Description"
                              multiline
                              rows={3}
                            />
                            <CommenTextField
                              name="ogTags.image"
                              label="OG Image URL"
                            />
                          </Stack>
                        </AccordionDetails>
                      </Accordion>

                      {/* Status Select (unchanged for now) */}
                      {/* <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel>Status</InputLabel>
                        <Controller
                          name="status"
                          control={control}
                          defaultValue="Draft"
                          render={({ field }) => (
                            <Select {...field} label="Status">
                              <MenuItem value="Draft">Draft</MenuItem>
                              <MenuItem value="Published">Published</MenuItem>
                              <MenuItem value="Scheduled">Scheduled</MenuItem>
                            </Select>
                          )}
                        />
                      </FormControl> */}
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>

              <CommonButton type="submit">Submit</CommonButton>
            </form>
          </Paper>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default EditBlog;
