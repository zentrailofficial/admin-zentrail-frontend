import { Box, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import CommenTextField from "../../commen-component/TextField/TextField";
import {
  Controller,
  FormProvider,
  set,
  useFieldArray,
  useForm,
} from "react-hook-form";
import CommenQuillEditor from "../../commen-component/TextEditor/TextEditor";
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import travelPackageStyle from "../../styles/travelPackage.js";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload.js";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import CommonButton from "../../commen-component/CommenButton/CommenButton.js";
import { Switch, FormControlLabel } from "@mui/material";
import { apiClient } from "../../lib/api-client.js";
import { useNavigate } from "react-router-dom";

const seasonOptions = [
  { value: "summer-trips", label: "Summer-trips" },
  { value: "winter-trips", label: "Winter-trips" },
  { value: "monsoon-trips", label: "Monsoon-trips" },
  { value: "autumn-trips", label: "Autumn-trips" },
];
const AddTravelPackage = () => {
  const [loading, setLoading] = useState(false);
  const methods = useForm({
    defaultValues: {
      type: "",
      offbeat: false,
      isActive: true,
      difficultyLevel: "Easy",
      altitude: "",
      itinerary: [{ title: "", description: "" }],
      faq: [{ question: "", answer: "" }],
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: "",
      },
      groupMembers: {
        minMembers: null,
        maxMembers: null,
      },
    },
  });

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const [exclusions, setExclusions] = useState([""]);
  const [inclusions, setInclusions] = useState([""]);
  const navigate = useNavigate();
  const [moodBasedList, setMoodBasedList] = useState([]);
  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: "faq",
  });
  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
    replace: replaceItinerary,
  } = useFieldArray({
    control,
    name: "itinerary",
  });
  const duration = watch("duration");
  const titleValue = watch("title");
  console.log(duration);

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
    const days = parseInt(duration) || 0;
    if (days > 0) {
      const newItinerary = Array.from({ length: days }, (_, i) => ({
        title: "",
        description: "",
      }));
      replaceItinerary(newItinerary);
    } else {
      replaceItinerary([]);
    }
  }, [duration, replaceItinerary]);
  const handleAddExclusion = () => {
    setExclusions([...exclusions, ""]);
  };
  const handleAddInclusion = () => {
    setInclusions([...inclusions, ""]);
  };

  useEffect(() => {
    const fetchMoodBased = async () => {
      try {
        const response = await apiClient.get("api/Moodbasejourney");
        const moodBased = response.data.data;
        console.log(moodBased);

        if (Array.isArray(moodBased)) {
          const data = moodBased.map((item) => ({
            value: item,
            label: item.title,
          }));
          console.log(data);
          setMoodBasedList(data);
        }
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchMoodBased();
  }, []);
  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);
    if (data.featuredImage?.length == 0) {
      toast.error("Featured image is required");
      return;
    }
    if (data.gallery?.length < 3) {
      toast.error("Gallery requires at least 3 images");

      return;
    }

    try {
      const formData = new FormData();
      // Add Travel Package
      formData.append("type", data.type);
      formData.append("offbeat", data.offbeat);
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("discount", Number(data.discount || 0));
      // Package Details
      formData.append("duration", data.duration);
      formData.append("altitude", data.altitude);
      formData.append("difficultyLevel", data.difficultyLevel || "");
      formData.append("season", data.season);
      formData.append("startLocation", data.startLocation);
      formData.append("endLocation",data.endLocation);
      formData.append("groupMembers", JSON.stringify(data.groupMembers));
      formData.append("itinerary", JSON.stringify(data.itinerary));
      formData.append("exclusions", JSON.stringify(data.exclusions));
      formData.append("inclusions", JSON.stringify(data.inclusions));
      //location
      formData.append("country", data.country);
      formData.append("state", data.state);
      formData.append("city", data.city);
      formData.append("weatherLocation", data.weatherLocation);
      //moodBased
      formData.append("moodOfJourney", JSON.stringify(data.moodOfJourney));
      //image
      if (data.featuredImage[0]?.file) {
        formData.append("featuredImage", data.featuredImage[0].file);
        formData.append(
          "featuredImageAlt",
          data.featuredImage[0].altText || ""
        );
      }
      data.gallery.forEach((item, index) => {
        if (item.file) {
          formData.append("gallery", item.file);
        }
      });
      formData.append("isActive", data.isActive || false);
      //Faq
      formData.append("faq", JSON.stringify(data.faq));
      //meta
      formData.append("seo", JSON.stringify(data.seo) || "");
      // formData.append("meta[description]", data.meta?.description || "");
      // formData.append("meta[keywords]", data.meta?.keywords || "");
      const response = await apiClient.post("/api/travel-packages/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response, "dadsda");
      if (response) {
        toast.success("Travel Package created successfully!");
        navigate("/travelpackage");
      }
    } catch (error) {
      console.error("Error creating travel package:", error?.response);
      toast.error(
        "Failed to create travel package. Please try again: ",
        error?.response
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              {/* Add Travel Package */}
              <Paper elevation={3} sx={travelPackageStyle.addTravel}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Add Travel Package
                </Typography>
                <Box sx={travelPackageStyle.customBox3}>
                  <CommonDropdown
                    options={[
                      { value: "tour", label: "Tour" },
                      { value: "trek", label: "Trek" },
                    ]}
                    name="type"
                    label="Type of Package *"
                    required
                  />

                  <FormControlLabel
                    control={
                      <Controller
                        name="offbeat"
                        control={methods.control}
                        render={({ field }) => (
                          <Switch {...field} checked={field.value} />
                        )}
                      />
                    }
                    label="Off Beat"
                    sx={{ whiteSpace: "nowrap" }}
                  />
                </Box>
                <CommenTextField
                  name="title"
                  label="Package Name *"
                  required
                  size="small"
                />
                <CommenTextField
                  name="slug"
                  label="slug"
                  size="small"
                  focused={watch("title")?.length}
                />
                <CommenQuillEditor
                  name="description"
                  label="Description * (min 150 characters)"
                  required
                  minLength={150}
                  placeholder="Write Overview/Trip Details here..."
                />
                <Box sx={travelPackageStyle.customBox3}>
                  <CommenTextField
                    name="price"
                    label="Price"
                    size="small"
                    required
                    type="number"
                  />
                  <CommenTextField
                    name="discount"
                    label="Discount"
                    type="number"
                    defaultValues="0"
                    size="small"
                  />
                </Box>
              </Paper>
              {/* Loaction */}
              <Paper elevation={3} sx={travelPackageStyle.addTravel}>
                <Typography variant="h6" gutterBottom fontWeight={600} required>
                  Loaction
                </Typography>
                <CommenTextField
                  name="country"
                  label="Country *"
                  required
                  size="small"
                />
                <CommenTextField
                  name="state"
                  label="State *"
                  required
                  size="small"
                />
                <CommenTextField
                  name="city"
                  label="City*"
                  required
                  size="small"
                />
                <CommenTextField
                  name="weatherLocation"
                  label="Weather Location*"
                  required
                  size="small"
                />
              </Paper>
              {/* Single Image Upload */}
              <Paper elevation={3} sx={travelPackageStyle.addTravel}>
                <Typography variant="h6" fontWeight={600}>
                  URL & Featured Image (Single Image)
                </Typography>
                <ImageUpload
                  name="featuredImage"
                  label="Choose Package Images"
                  multiple
                  altText
                  required
                />
              </Paper>
              {/* Type of Mood Of Journey */}
              <Paper elevation={3} sx={travelPackageStyle.addTravel}>
                <Typography variant="h6" fontWeight={600}>
                  Type of Mood Of Journey
                </Typography>

                <CommonDropdown
                  name="moodOfJourney"
                  label="Select of Mood Of Journey *"
                  options={moodBasedList}
                  // onChangeValues={handleMoodOfJourneyChange}
                  required
                />
              </Paper>
              {/* {FAQs} */}
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
              </Paper>
              <Paper elevation={3} sx={travelPackageStyle.addTravel}>
                <Box sx={travelPackageStyle.buttonBox}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="isActive"
                        control={methods.control}
                        render={({ field }) => (
                          <Switch {...field} checked={field.value} />
                        )}
                      />
                    }
                    label="Is Active"
                  />
                  <CommonButton
                    sx={travelPackageStyle.customButton}
                    type="submit"
                    loading={loading}
                    disabled={loading}
                  >
                    Submit
                  </CommonButton>
                </Box>
              </Paper>
            </Grid>

            {/* Right side */}
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              {/* Package Details */}
              <Paper elevation={3} sx={travelPackageStyle.addTravel}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Package Details
                </Typography>

                <CommenTextField
                  name="duration"
                  label="Duration*  ex: (4D/5N)"
                  required
                  minLength={5}
                  size="small"
                />
                {/* trek only */}
                {methods.watch("type") == "trek" && (
                  <>
                    <CommenTextField
                      name="altitude"
                      label="Altitude *"
                      // required
                      size="small"
                    />
                    <CommonDropdown
                      name="difficultyLevel"
                      label="Difficulty Level *"
                      options={[
                        { value: "Easy", label: "Easy" },
                        { value: "Moderate", label: "Moderate" },
                        { value: "Difficult", label: "Difficult" },
                      ]}
                      // required
                    />
                  </>
                )}
                {/*  min and max members name change karna haa */}
                <CommonDropdown
                  name="season"
                  label="Select Season *"
                  options={seasonOptions}
                  required
                />
                <Box sx={travelPackageStyle.customBox3}>
                  <CommenTextField
                    name="groupMembers.minMembers"
                    label="Min Members"
                    size="small"
                    type="number"
                    required
                  />
                  <CommenTextField
                    name="groupMembers.maxMembers"
                    label="Max Members"
                    size="small"
                    type="number"
                    required
                  />
                </Box>
                <Box sx={travelPackageStyle.customBox3}>
                  <CommenTextField
                    name="startLocation"
                    label="Start Location *"
                    size="small"
                   
                    required
                  />
                  <CommenTextField
                    name="endLocation"
                    label="End Location "
                    size="small"
                    required
                  />
                </Box>
              </Paper>
              {/* itinerary */}

              {itineraryFields?.length > 0 && (
                <Paper elevation={3} sx={travelPackageStyle.addTravel}>
                  <Stack direction="column" mb={2}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Itinerary
                    </Typography>

                    {itineraryFields.map((item, index) => (
                      <Box key={item.id} sx={travelPackageStyle.customFaqBox}>
                        <Typography variant="subtitle1">
                          {`Day ${index + 1}`}
                        </Typography>

                        <CommenTextField
                          name={`itinerary.${index}.title`}
                          label="Title *"
                          size="small"
                          defaultValues=""
                          required
                        />

                        <CommenQuillEditor
                          name={`itinerary.${index}.description`}
                          label="Description *"
                          required
                          placeholder="Write itinerary details here..."
                        />
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* (Inclusions) */}
              <Paper elevation={3} sx={travelPackageStyle.addTravel}>
                <Stack sx={travelPackageStyle.customFaq}>
                  <Typography variant="h6" fontWeight={600}>
                    Inclusions
                  </Typography>
                  <IconButton color="primary" onClick={handleAddInclusion}>
                    <AddIcon />
                  </IconButton>
                </Stack>
                {inclusions.map((inclusion, index) => (
                  <CommenTextField
                    key={index}
                    name={`inclusions[${index}]`}
                    label={`Inclusion ${index + 1}*`}
                    required
                    size="small"
                  />
                ))}
              </Paper>
              {/*  Exclusion */}
              <Paper elevation={3} sx={travelPackageStyle.addTravel}>
                <Stack sx={travelPackageStyle.customFaq}>
                  <Typography variant="h6" fontWeight={600}>
                    Exclusions
                  </Typography>
                  <IconButton color="primary" onClick={handleAddExclusion}>
                    <AddIcon />
                  </IconButton>
                </Stack>

                {exclusions.map((exclusion, index) => (
                  <CommenTextField
                    key={index}
                    name={`exclusions[${index}]`}
                    label={`Exclusion ${index + 1}*`}
                    required
                    size="small"
                  />
                ))}
              </Paper>
              {/* Gallery */}
              <Paper elevation={3} sx={travelPackageStyle.addTravel}>
                <Typography variant="h6" fontWeight={600}>
                  Gallery (Min 3 images)
                </Typography>
                <ImageUpload
                  name="gallery"
                  label="Choose Package Images"
                  multiple
                  altText
                />
              </Paper>
              <Paper elevation={3} sx={travelPackageStyle.addTravel}>
                <Typography variant="h6" fontWeight={600}>
                  Meta Tags
                </Typography>
                <CommenTextField
                  name="seo.metaTitle"
                  label="Meta Title *"
                  required
                  maxLength={60}
                  messages={{
                    required: "Meta title is ////required",
                    maxLength: "Please do not exceed 60 characters",
                  }}
                />
                <CommenTextField
                  name="seo.metaDescription"
                  label="Meta Description *"
                  multiline
                  required
                  rows={3}
                  maxLength={160}
                  messages={{
                    required: "Meta description is ////required",
                    maxLength: "Please do not exceed 160 characters",
                  }}
                />
                <CommenTextField name="seo.keywords" label="keywords" />
              </Paper>
            </Grid>
          </Grid>
         
        </Box>
      </form>
    </FormProvider>
  );
};

export default AddTravelPackage;
