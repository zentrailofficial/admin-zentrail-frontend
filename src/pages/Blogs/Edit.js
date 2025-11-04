import { useEffect, useState, useCallback } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import {
  Box,
  Typography,
  Stack,
  Grid,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
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
import BookIcon from "@mui/icons-material/Book";
import { apiClient } from "../../lib/api-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CommenQuillEditor from "../../commen-component/TextEditor/TextEditor";
import commoncss from "../../styles/commoncss";
import CommonToolTip from "../../commen-component/CommonToolTip/CommonToolTip";
import { toast } from "react-toastify";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import CustomCKEditor from "../../commen-component/TextEditor2/TextEditor2";

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // assuming route = /edit/:id
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const methods = useForm({
    defaultValues: {
      title: "",
      type: "",
      author: "",
      content: "",
      description: "",
      images: [],
      meta: {},
      ogTags: {},
      Status: "",
      faq: [{ question: "", answer: "" }],
    },
  });
  const { reset, handleSubmit, getValues, formState, control } = methods;
  const { isDirty } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "faq",
  });
  const [loading, setLoading] = useState(true);
  const [btnloading, setbtnLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isDirty || btnloading) return;
    const currentPath = location.pathname;
    const handlePopState = () => {
      if (isDirty && !btnloading) {
        setPendingNavigation(() => () => {
          navigate(-1);
        });
        setShowExitDialog(true);
        window.history.pushState(null, "", currentPath);
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.history.pushState(null, "", currentPath);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty, btnloading, location.pathname, navigate]);

  const handleExitConfirm = () => {
    setShowExitDialog(false);
    navigate("/blog");
  };
  const handleExitCancel = () => {
    setShowExitDialog(false);
  };

  useEffect(() => {
    apiClient.get("/api/category/blog-categories").then((data) => {
      const option = data.data.map((category) => ({
        value: category._id,
        label: category.name,
      }));
      setCategoryOptions(option);
    });
  }, []);
console.log(methods.getValues());
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(`/api/blogs/${id}`);
        const blog = res.data.blog;
        const mapped = {
          title: blog.title,
          type: blog.type,
          author: blog.authorName,
          description: blog.description,
          uid: blog?.uid,
          category: blog.category?._id,
          Status: blog.status,
          faq:
            Array.isArray(blog.faq) && blog.faq.length > 0
              ? blog.faq
              : [{ question: "", answer: "" }],
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
        reset(mapped);
        setLoading(false);
      } catch (err) {}
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setbtnLoading(true);
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("uid", data.uid);
      formData.append("authorName", data.author);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("tags", JSON.stringify(data.tags || []));
      formData.append("status", data.Status);
      formData.append("faq", JSON.stringify(data.faq));

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
        toast.success("Blog updated successfully");
        navigate("/blog");
        setbtnLoading(false);
      }
    } catch (error) {
      const message =
      error.response?.data?.message || "Failed to update. Please try again.";
    toast.error(message);
      setbtnLoading(false);
    }
  };

  const handleAddMore = () => {
    alert("Add more clicked!");
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box sx={commoncss.box}>
            <Box maxWidth="xl" mx="auto">
              <Grid container sx={commoncss.grid1}>
                {/* Left Section */}
                <Grid item xs={12} md={6} sx={commoncss.leftGrid}>
                  <Paper elevation={3} sx={commoncss.cardlineargradient}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={3}
                    >
                      <BookIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Update Blog
                      </Typography>
                      <CommonToolTip title="Update your Blog" />
                    </Stack>
                    <Box sx={commoncss.customBox1}>
                      <Box sx={commoncss.labelbox}>
                        {" "}
                        <label>Blog Title </label>{" "}
                      </Box>
                      <Box sx={commoncss.tooltipbox}>
                        {" "}
                        <CommonToolTip title="Blog's Title" />
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
                          disabled
                        />
                      </Box>
                    </Box>
                    <Box sx={commoncss.customBox1}>
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
                          required
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

                    {/* Category and Tags */}

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
                      <CommonToolTip title="Please select one" />
                    </Stack>

                    <CommonDropdown
                      name="category"
                      label="Category *"
                      options={categoryOptions}
                      required
                      showAddMore
                      onAddMoreClick={handleAddMore}
                    />
                  </Paper>

                  {/* URL and Image */}
                  <Paper elevation={3} sx={commoncss.cardlineargradient}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={3}
                    >
                      <ImageIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        URL & Featured Image
                      </Typography>
                      <CommonToolTip title="Include at least one image with alt text" />
                    </Stack>

                    <Stack spacing={3}>
                      <ImageUpload
                        name="images"
                        label="Choose Blog Images"
                        altText
                      />
                    </Stack>
                  </Paper>
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
                <Grid item xs={12} md={6} sx={commoncss.rightGrid}>
                  <Paper elevation={3} sx={commoncss.cardlineargradient}>
                    <Stack spacing={3}>
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
                        <CommonToolTip title=" SEO Settings" />
                      </Stack>
                      <Box sx={commoncss.meta}>
                        <Box sx={commoncss.customBox1}>
                          <Box sx={commoncss.labelbox}>
                            {" "}
                            <label>uid </label>{" "}
                          </Box>
                          <Box sx={commoncss.tooltipbox}>
                            {" "}
                            <CommonToolTip title="URL slug" />
                          </Box>
                          <Box sx={commoncss.fieldbox}>
                            {" "}
                            <CommenTextField
                              name="uid"
                              label="uid"
                              disabled
                              size="small"
                            />
                          </Box>
                        </Box>
                        <Box sx={commoncss.metabox1}>
                          <Box sx={commoncss.labelbox}>
                            {" "}
                            <label>Meta Title</label>
                          </Box>
                          <Box sx={commoncss.tooltipbox}>
                            {" "}
                            <CommonToolTip title="60 characters only" />
                          </Box>
                          <Box sx={commoncss.fieldbox}>
                            <CommenTextField
                              name="meta.title"
                              label="Meta Title *"
                              required={true}
                              maxLength={60}
                              messages={{
                                required: "Meta title is required",
                                maxLength: "Please do not exceed 60 characters",
                              }}
                            />{" "}
                          </Box>
                        </Box>
                        <Box sx={commoncss.metabox1}>
                          <Box sx={commoncss.labelbox}>
                            {" "}
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
                          {/* <CommenTextField
                        name="meta.canonicalUrl"
                        label="Canonical URL"
                      /> */}
                        </Box>
                        <Box sx={commoncss.metabox1}>
                          <Box sx={commoncss.labelbox}>
                            {" "}
                            <label>Meta Description *</label>
                          </Box>
                          <Box sx={commoncss.tooltipbox}>
                            {" "}
                            <CommonToolTip title="160 characters only" />
                          </Box>
                          <Box sx={commoncss.fieldbox}>
                            {" "}
                            <CommenTextField
                              name="meta.description"
                              label="Meta Description *"
                              multiline
                              rows={3}
                              maxLength={160}
                              messages={{
                                required: "Meta description is required",
                                maxLength:
                                  "Please do not exceed 160 characters",
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Stack>
                  </Paper>
                  <Paper elevation={3} sx={commoncss.cardlineargradient}>
                    <Box sx={commoncss.metabox1}>
                          <Box sx={commoncss.labelbox}>
                            {" "}
                            <label>Status</label>
                          </Box>
                          <Box sx={commoncss.tooltipbox}>
                            {" "}
                            <CommonToolTip title="After checking the blog and news publication, I was't able to draft it."/>
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

                  <CommonButton type="submit" loading={btnloading}>
                    Submit
                  </CommonButton>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </form>
      </FormProvider>

      {/* Exit Confirmation Dialog */}
      <Dialog
        open={showExitDialog}
        onClose={handleExitCancel}
        aria-labelledby="exit-dialog-title"
        aria-describedby="exit-dialog-description"
      >
         <Paper sx={commoncss.cardlineargradient1}>
        <DialogTitle varient="h6" fontWeight={600}id="exit-dialog-title">Unsaved Changes</DialogTitle>
        <DialogContent>
          <DialogContentText id="exit-dialog-description">
             <Typography variant="p" fontWeight={600}>
            You have unsaved changes. Are you sure you want to leave this page?
            Your changes will be lost.</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CommonButton onClick={handleExitCancel}>Stay</CommonButton>
          <CommonButton onClick={handleExitConfirm} autoFocus>
            Leave Without Saving
          </CommonButton>
        </DialogActions>
        </Paper>
      </Dialog>
    </>
  );
};

export default EditBlog;
