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
import { useNavigate, useParams } from "react-router-dom";
import BookIcon from "@mui/icons-material/Book";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import travelPackageStyle from "../../styles/travelPackage";
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import categoryStyle from "../../styles/category";
import { appendImagesToFormData } from "../../utils/helperFunctions";
import { toast } from "react-toastify";
import commoncss from "../../styles/commoncss";
import CommonToolTip from "../../commen-component/CommonToolTip/CommonToolTip";
import CommenQuillEditor from "../../commen-component/TextEditor/TextEditor";
import ImageIcon from "@mui/icons-material/Image";
import SettingsIcon from "@mui/icons-material/Settings";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SkeletonLoader from "../../commen-component/Reusable/SkeletonLoader";
import CustomCKEditor from "../../commen-component/TextEditor2/TextEditor2";


const EditSubCategory = () => {
  const [formKey, setFormKey] = useState(0);
  const [loading, setloading] = useState(false);
  const { id } = useParams();
  const [categoriesList, setCategoriesList] = useState([]);
  const methods = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      metaTitle: "",
      metaDescription: "",
      image: [],
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
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    if (!data?.image?.length) {
      return toast.error("Image is required")
    }
    try {
      const formData = new FormData();
      formData.append("categoryId", data.categoryId);
      formData.append("title", data?.title);
      formData.append("bannertitle", data?.bannertitle);

      formData.append("uid", data.uid);
      formData.append("description", data?.description);
      formData.append("metaTitle", data?.metaTitle);
      formData.append("metaDescription", data?.metaDescription);
      formData.append("metaKeyword", data?.metaKeyword);
      formData.append("faq", JSON.stringify(data?.faq));
      formData.append("status", data.status);
      // formData.append("image", data?.image);
      // if (data.image[0]?.file) {
      // formData.append("image", data?.image[0]?.file);
      // formData.append("imageAlt", data?.image[0]?.altText || "");
      // }
      try {
        if (Array.isArray(data.image)) {
          await appendImagesToFormData(data.image, formData);
        }
      } catch (imageError) {
        toast.error(imageError.message || "Please provide alt text for all images.");
        return;
      }
      await apiClient.put(`/api/subcategory/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // methods.reset();
      navigate("/listsubcategory");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const fetchService = async () => {
      setloading(true)
      try {
        const res = await apiClient.get(
          `/api/subcategory/${id}`
        );
        // setCategoriesList([{value:res?.data?.categoryId?._id, label:res?.data?.categoryId?.name}]);
        methods.reset({
          ...res.data, categoryId: res?.data?.categoryId?._id,

          image: res?.data?.image ? [
            {
              url: res?.data?.image,
              altText: res?.data?.imageAlt,
            },
          ] : []
          //    image: res?.data[0]?.image
          // ? [
          //   {
          //     url: res?.data[0]?.image,
          //     altText: res?.data[0]?.imageAlt || "",
          //   },
          // ]
          // : [],
          //     set
          //    categoryId: res.data.categoryId 

          // image: res.data.image
          //   ? [
          //       {
          //         file: "https://res.cloudinary.com/dtidgvjlt/image/upload/v1754897645/categories/gsuj1pm6qx35snwkyiol.webp", // No actual file since it's from server
          //         altText: res.data.imageAlt || "",
          //         preview: `${process.env.REACT_APP_API_URL}/${res.data.image}`,
          //       },
          //     ]
          //   : [],
        });
        setFormKey(prev => prev + 1);
      } catch (err) {
        toast.error("Error fetching service", err);
      } finally {
        setloading(false)
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return <SkeletonLoader />
  }
  return (
    <Box>
      <FormProvider key={formKey} {...methods}>
        {/* <Box
                   component="form"
                   onSubmit={methods.handleSubmit(onSubmit)}
                   noValidate
                 > */}

        <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                      <Stack direction="row" spacing={2} mb={2}>
                        <BookIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                          Update  SubCategory
                        </Typography>
                      </Stack>
                      <Box sx={commoncss.meta}>
                        <Box sx={commoncss.metabox1}>
                          <Box sx={commoncss.labelbox}> <label >SubCategory Name</label></Box>
                          <Box sx={commoncss.tooltipbox}> <CommonToolTip title=" New SubCategory" /></Box>
                          <Box sx={commoncss.fieldbox1}>
                            <CommenTextField
                              name="title"
                              label="SubCategory Name"
                              focused={true}
                              required
                            />
                          </Box>
                        </Box>
                        <Box sx={commoncss.metabox1}>
                          <Box sx={commoncss.labelbox}> <label >Select Category *</label></Box>
                          <Box sx={commoncss.tooltipbox}><CommonToolTip title="Please select one" /></Box>
                          <Box sx={commoncss.fieldbox1}>  <CommonDropdown
                            name="categoryId"
                            label="Select of Category *"
                            options={categoriesList}
                            // onChangeValues={handleMoodOfJourneyChange}
                            required
                          //  defaultValues={{name:"mweh wcwc",value:"mwqhdbjh "}}
                          /></Box>
                        </Box>
                        <Box sx={commoncss.metabox1}>
                          <Box sx={commoncss.labelbox}> <label >Banner Title</label></Box>
                          <Box sx={commoncss.tooltipbox}> <CommonToolTip title="Maximum 100 characters only" /></Box>
                          <Box sx={commoncss.fieldbox1}>
                            <CommenTextField
                              name="bannertitle"
                              label="Banner Title"
                              maxLength={100}
                              focused={true}
                              required
                            />
                          </Box>
                        </Box>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          mb={1}
                        >
                          <ImageIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>
                            Banner Image
                          </Typography>
                          <CommonToolTip title="Include at least one image with alt text" />
                        </Stack>
                        <ImageUpload
                          name="image"
                          focused={isEdit}
                          label="Image"
                          altText
                        // defaultImage={defaultImage}
                        />
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
                          required minLength={30}
                          label="Category description" /> */}

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
                          <Box sx={commoncss.labelbox}>
                            <label>Slug</label>
                          </Box>
                          <Box sx={commoncss.tooltipbox}>
                            <CommonToolTip title="URL slug" />
                          </Box>
                          <Box sx={commoncss.fieldbox}>
                            <CommenTextField
                              name="uid"
                              label="slug"
                              required
                              disabled
                              focused={true}
                            />
                          </Box>
                        </Box>
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
                          <Box sx={commoncss.tooltipbox}>  <CommonToolTip title="SEO friendly keywords" /></Box>
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
                      </Box>
                    </Paper>
                    <Paper elevation={3} sx={commoncss.cardlineargradient}>
                      <Box sx={commoncss.metabox1}>
                        <Box sx={commoncss.labelbox}>
                          <label>Status</label>
                        </Box>
                        <Box sx={commoncss.tooltipbox}>
                          <CommonToolTip title="After checking the blog and news publication, I was't able to draft it." />
                        </Box>
                        <Box sx={commoncss.fieldbox}>
                          <CommonDropdown
                            name="status"
                            label="status"
                            options={[
                              { label: "Draft", value: "Draft" },
                              { label: "Published", value: "Published" },
                            ]}
                          />
                        </Box>
                      </Box>
                    </Paper>
                    <CommonButton
                      type="submit"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      fullWidth={false}
                    >
                      {"Update Category"}
                    </CommonButton>
                  </Grid>
                </Grid>
              </Box>








              {/* <Stack direction="row" spacing={2} mb={2}>
                <BookIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Update  SubCategory
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
                          name="categoryId"
                          label="Select of Category *"
                          options={categoriesList}
                          // onChangeValues={handleMoodOfJourneyChange}
                          required
                        //  defaultValues={{name:"mweh wcwc",value:"mwqhdbjh "}}
                        />

                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }}>
                        <CommenTextField
                          name="title"
                          label="SubCategory Name"
                          focused={true}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <CommenTextField
                          name="uid"
                          label="slug"
                          required
                          disabled
                          focused={true}
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
                          rows={4}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <CommenTextField
                          name="description"
                          focused={isEdit}
                          label="Description"
                          multiline
                          rows={4}
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
                          name="metaKeyword"
                          focused={true}
                          label="meta keywords"
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
              </Paper> */}

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
                    {"Update Category"}
                  </CommonButton>
                </Box>
              </Paper> */}
            </Box></>
        </form>
        {/* </Box> */}
      </FormProvider>
    </Box>
  )
}

export default EditSubCategory