import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Book as BookIcon,
  Category as CategoryIcon,
  Image as ImageIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import CommenTextField from "../../commen-component/TextField/TextField";
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import { apiClient } from "../../lib/api-client";
import commoncss from "../../styles/commoncss";
import CommonToolTip from "../../commen-component/CommonToolTip/CommonToolTip";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AssistantIcon from '@mui/icons-material/Assistant';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { toast } from "react-toastify";
import CustomCKEditor from "../../commen-component/TextEditor2/TextEditor2";

const ServiceFormBase = ({ defaultValues, mode = "add", serviceId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [portfolioOptions, setPortfolioOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);

  const methods = useForm({ defaultValues });
  const { setValue, control, handleSubmit } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "faq" });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCategory = await apiClient.get("/api/category");
        setCategoryOptions(
          resCategory.data.map((c) => ({ value: c._id, label: c.name }))
        );
        setPortfolioOptions(
          resCategory.data.map((c) => ({ value: c._id, label: c.name }))
        );

        const resServices = await apiClient.get("/api/service");
        setServiceOptions(
          resServices.data.services.map((s) => ({
            value: s._id,
            label: s.name,
          }))
        );
      } catch (err) {
        toast.error("Error fetching dropdown data", err);
      }
    };
    fetchData();
  }, []);

  const textToSlug = (text) =>
    text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

  const onSubmit = async (data) => {
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
        const img = data.featuredImage[0];

        if (img.file instanceof File) {
          formData.append("featuredImage", img.file);
          formData.append("featuredImageAlt", img.altText || "");
        } else if (img.url) {
          formData.append("featuredImageAlt", img.altText || "");
        }
      }
      formData.append("meta[title]", data.meta?.title || "");
      formData.append("meta[description]", data.meta?.description || "");
      formData.append("meta[keywords]", data.meta?.keywords || "");
      formData.append("meta[canonicalUrl]", data.meta?.canonicalUrl || "");

      formData.append("ogTags[title]", data.ogTags?.title || "");
      formData.append("ogTags[description]", data.ogTags?.description || "");
      formData.append("ogTags[image]", data.ogTags?.image || "");

      formData.append("faq", JSON.stringify(data.faq));
      if (!Array.isArray(data.whyPoornam)) {
        data.whyPoornam = [data.whyPoornam];
      }
      formData.append("whyPoornam", JSON.stringify(data.whyPoornam));
      let response;
      if (mode === "add") {
        response = await apiClient.post("/api/service/servicepage", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await apiClient.put(
          `/api/service/editservice/${serviceId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      if ([200, 201].includes(response.status)) {
        setLoading(false);
        navigate("/services");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to save service");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={commoncss.mainbox}>
          <Box maxWidth="xl" mx="auto">
            <Grid container sx={commoncss.grid1}>
              {/* Left Section */}
              <Grid item xs={12} md={6} sx={commoncss.leftGrid}>
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <BookIcon color="primary" />
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Add New Service
                    </Typography>
                  </Stack>
                  <Box sx={commoncss.metabox1}>
                    <Box sx={commoncss.labelbox}><label>Blog Title </label>{" "}</Box>
                    <Box sx={commoncss.tooltipbox}>{" "}<CommonToolTip title="70 characters only" /></Box>
                    <Box sx={commoncss.fieldbox1}> {" "}
                      <CommenTextField
                        name="title"
                        label="Service Title *"
                        maxLength={70}
                        required
                        size="small"
                        onChange={(val) => setValue("uid", textToSlug(val))}
                      />
                    </Box>
                  </Box>
                  <Box sx={commoncss.editorBox}>
                    <label>Description *</label>
                    <CustomCKEditor
                      name="description"
                      required
                      minLength={30}
                      placeholder="Write content here..."
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
                      Select Blog Category
                    </Typography>
                    <CommonToolTip title="Please select one" />
                  </Stack>
                  <CommonDropdown
                    name="blogcategory"
                    label="Blog Category *"
                    options={categoryOptions}
                    required
                  />
                </Paper>
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
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
                    <CommonToolTip title="Include at least one image with alt text" />
                  </Stack>
                  <ImageUpload
                    name="featuredImage"
                    label="Choose Service Images"
                    altText
                  />
                </Paper>
                {/* <Card elevation={2} sx={{ borderRadius: 3 }}>
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
                </Card> */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    mb={3}
                  >
                    <AssistantIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Service feature
                    </Typography>
                    <CommonToolTip title="Feature your services" />
                  </Stack>
                  <CommonDropdown
                    name="serviceCategory"
                    label="Service Category *"
                    multiple
                    options={serviceOptions}
                    required
                  />
                </Paper>

                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    mb={3}
                  >
                    <ImageSearchIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Gallery
                    </Typography>
                    <CommonToolTip title="select as pr your requirement" />
                  </Stack>
                  <CommonDropdown
                    name="Portfolio"
                    label="Portfolio *"
                    options={portfolioOptions}
                    required
                  />
                </Paper>
                {/* Why Poornam Section */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    mb={3}
                  >
                    <ThumbUpAltIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Why Poornam ?
                    </Typography>
                    <CommonToolTip title="Help us understand you more!" />
                  </Stack>
                  <Box sx={commoncss.metabox1}>
                    <Box sx={commoncss.labelbox}>  <label>Title</label>{" "}   </Box>
                    <Box sx={commoncss.tooltipbox}> <CommonToolTip title="Why Poornam" />{" "}  </Box>
                    <Box sx={commoncss.fieldbox1}>
                      <CommenTextField
                        name="whyPoornam[0].title"
                        label="Title *"
                        maxLength={60}
                        required
                      />
                    </Box>
                  </Box>
                  <Box sx={commoncss.metabox1}>
                    <Box sx={commoncss.labelbox}>  <label>Description</label>{" "}   </Box>
                    <Box sx={commoncss.tooltipbox}> <CommonToolTip title="Help us understand more" />{" "}  </Box>
                    <Box sx={commoncss.fieldbox1}>
                      <CommenTextField
                        name="whyPoornam[0].description"
                        label="Description *"
                        maxLength={160}
                        required
                        multiline
                        rows={3}
                      />
                    </Box>
                  </Box>


                </Paper>
              </Grid>

              <Grid item xs={12} md={6} sx={commoncss.rightGrid}>
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <SettingsIcon color="primary" />
                    <Typography variant="h6" fontWeight="600">
                      SEO Settings
                    </Typography>
                  </Stack>
                  {/* Meta Tags Accordion */}
                  <Typography fontWeight="600" textAlign="center">
                    Meta Tags
                  </Typography>
                  <Box sx={commoncss.meta}>
                    <Box sx={commoncss.metabox1}>
                      <Box sx={commoncss.labelbox}>  <label>uid </label>{" "} </Box>
                      <Box sx={commoncss.tooltipbox}> <CommonToolTip title="URL slug" />{" "} </Box>
                      <Box sx={commoncss.fieldbox}>
                        <CommenTextField name="uid" label="uid" size="small" />
                      </Box>
                      {/* <Box sx={commoncss.fieldbox}>
                                            {" "}
                                            <CommenTextField
                                              name="uid"
                                              label="uid"
                                              size="small"
                                              maxLength={70}
                                              focused={watch("title")?.length}
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
                                          </Box> */}
                    </Box>
                    <Box sx={commoncss.metabox1}>
                      <Box sx={commoncss.labelbox}> <label>Meta Title</label>{" "} </Box>
                      <Box sx={commoncss.tooltipbox}> {" "} <CommonToolTip title="60 characters only" />  </Box>
                      <Box sx={commoncss.fieldbox}> {" "}
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
                      <Box sx={commoncss.labelbox}> <label>Keywords</label>  </Box>
                      <Box sx={commoncss.tooltipbox}>  {" "} <CommonToolTip title="SEO friendly keywords" /> </Box>
                      <Box sx={commoncss.fieldbox}>  {" "}
                        <CommenTextField
                          name="meta.keywords"
                          label="Keywords"
                        />
                      </Box>
                    </Box>
                    <Box sx={commoncss.metabox1}>
                      <Box sx={commoncss.labelbox}> {" "} <label>Meta Description </label></Box>
                      <Box sx={commoncss.tooltipbox}> <CommonToolTip title="160 characters only" />  </Box>
                      <Box sx={commoncss.fieldbox}>  {" "}
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



                    {/* OG Tags Accordion */}


                    <Typography fontWeight="600" textAlign="center" mt={2}>
                      Open Graph
                    </Typography>
                    <Box sx={commoncss.metabox1}>
                      <Box sx={commoncss.labelbox}>  <label>OG Title</label>{" "}   </Box>
                      <Box sx={commoncss.tooltipbox}> <CommonToolTip title="OG tittle" />{" "}  </Box>
                      <Box sx={commoncss.fieldbox}>
                        <CommenTextField name="ogTags.title" label="OG Title" />
                      </Box>
                    </Box>
                    <Box sx={commoncss.metabox1}>
                      <Box sx={commoncss.labelbox}> <label>OG Description</label>{" "} </Box>
                      <Box sx={commoncss.tooltipbox}> <CommonToolTip title="OG Description" />{" "} </Box>
                      <Box sx={commoncss.fieldbox}>
                        <CommenTextField
                          name="ogTags.description"
                          label="OG Description"
                          multiline
                          rows={3}
                        />
                      </Box>
                    </Box>
                    <Box sx={commoncss.metabox1}>
                      <Box sx={commoncss.labelbox}> <label>OG image URL</label>{" "}  </Box>
                      <Box sx={commoncss.tooltipbox}> <CommonToolTip title="Please provide URL of your OG image" />{" "}  </Box>
                      <Box sx={commoncss.fieldbox}>
                        <CommenTextField name="ogTags.image" label="OG image URL" />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    mb={3}
                  >
                    <HourglassTopIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Status
                    </Typography>
                    <CommonToolTip title="Please select your status" />
                  </Stack>
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
                  </Box>
                </Paper>


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

              </Grid>
            </Grid>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
};

export default ServiceFormBase;
