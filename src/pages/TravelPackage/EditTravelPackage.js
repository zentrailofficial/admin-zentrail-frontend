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
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import CommonButton from "../../commen-component/CommenButton/CommenButton.js";
import { Switch, FormControlLabel } from "@mui/material";
import { apiClient } from "../../lib/api-client.js";
import { useNavigate, useParams } from "react-router-dom";
import CommonToolTip from "../../commen-component/CommonToolTip/CommonToolTip.js";
import commoncss from "../../styles/commoncss.js";
import LocationSearch from "../../commen-component/Address/autocomplete.js";
import PinDropIcon from "@mui/icons-material/PinDrop";
import BookIcon from "@mui/icons-material/Book";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import BackpackIcon from "@mui/icons-material/Backpack";
import SettingsIcon from "@mui/icons-material/Settings";
import TodayIcon from "@mui/icons-material/Today";
import WarningIcon from "@mui/icons-material/Warning";
import AddTaskIcon from "@mui/icons-material/AddTask";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";
import CustomCKEditor from "../../commen-component/TextEditor2/TextEditor2.js";

const seasonOptions = [
  { value: "summer-trips", label: "Summer-trips" },
  { value: "winter-trips", label: "Winter-trips" },
  { value: "monsoon-trips", label: "Monsoon-trips" },
  { value: "autumn-trips", label: "Autumn-trips" },
];
const EditTravelPackage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const param = useParams();

  const travelPackageId = param.id;

  const methods = useForm({
    defaultValues: {
      type: "",
      offbeat: false,
      subtitle: "",
      isActive: true,
      difficultyLevel: "Easy",
      season: "",
      featuredImage: [],
      batches: [{ fromDate: "", toDate: "" }],
      // moodOfJourney:{ value: "For Peace & Calm", label: "For Peace & Calm" },
      altitude: "",
      // altitudeunit: "",
      itinerary: [{ title: "", description: "" }],
      faq: [{ question: "", answer: "" }],
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: "",
      },
      discount: { amount: 0, percentage: 0, type: "amount" },
      groupMembers: {
        minMembers: null,
        maxMembers: null,
      },
      locationAddress: "",
      city: "",
      state: "",
      country: "",
    },
  });

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    setFocus,
    formState: { isSubmitting, errors },
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
  const {
    fields: batchesFields,
    append: appendBathches,
    remove: removeBatches,
    replace: replaceBatches,
  } = useFieldArray({
    control,
    name: "batches",
  });
  const duration = watch("duration");
  const titleValue = watch("title");

  const discount = watch("discount");

  const price = watch("price");
  // 🧠 Automatically reset other discount field to 0 based on selected type
  useEffect(() => {
    if (discount?.type === "amount") {
      setValue("discount.percentage", 0);
    } else if (discount?.type === "percentage") {
      setValue("discount.amount", 0);
    }
  }, [discount?.type, setValue]);

  const onError = (errors) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      setFocus(firstErrorField);
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      toast.error(`Please check "${firstErrorField}" field`);
    }
  };

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
        if (Array.isArray(moodBased)) {
          const data = moodBased.map((item) => ({
            value: item.title,
            label: item.title,
          }));
          setMoodBasedList(data);
        }
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchMoodBased();
  }, []);

  console.log(moodBasedList);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(
          `api/travel-packages/${travelPackageId}`
        );
        const travelPackage = response.data.data;
        console.log(response.data.data);
        const parsedInclusions = Array.isArray(travelPackage?.inclusions)
          ? JSON.parse(travelPackage?.inclusions[0] || "[]")
          : [];

        const parsedExclusions = Array.isArray(travelPackage?.exclusions)
          ? JSON.parse(travelPackage?.exclusions[0] || "[]")
          : [];
        const parsedBatches = Array.isArray(travelPackage.batches)
          ? travelPackage.batches.map((b) => ({
            ...b,
            fromDate: b.fromDate ? b.fromDate.split("T")[0] : "",
            toDate: b.toDate ? b.toDate.split("T")[0] : "",
          }))
          : [];
        const matchedMood =
          moodBasedList.find(
            (item) => item.value === travelPackage?.moodOfJourney?.title
          ) || null;

        console.log(matchedMood);

        const parsedItinerary = Array.isArray(travelPackage.itinerary)
          ? travelPackage.itinerary.map((b) => ({
            title: b.title || "",
            description: b.description || "",
          }))
          : [];

        methods.reset({
          ...travelPackage,
          moodOfJourney: matchedMood?.label,
          groupMembers: travelPackage.groupMembers[0],
          featuredImage: travelPackage.featuredImage?.url
            ? [
              {
                url: travelPackage.featuredImage.url,
                altText: travelPackage.featuredImage.alt,
              },
            ]
            : [],
          gallery: Array.isArray(travelPackage.gallery)
            ? travelPackage.gallery.map((img) => ({
              url: img.url,
              altText: img.alt || "",
            }))
            : [],
          batches: parsedBatches,
          locationAddress: travelPackage.locationAddress || "",
          discount: {
            amount: travelPackage.discount.amount,
            percentage: travelPackage.discount.percentage,
            type: travelPackage.discount.amount ? "amount" : "percentage",
          },
          itinerary: parsedItinerary,
          inclusions: parsedInclusions,
          exclusions: parsedExclusions,
        });
        setInclusions(parsedInclusions);
        setExclusions(parsedExclusions);
        replaceBatches(parsedBatches);
        replaceItinerary(parsedItinerary);
        setFormKey((prev) => prev + 1);
      } catch (error) {
        console.error(error);
      }
    };
    if (moodBasedList?.length > 0) {
      fetchData();
    }
  }, [param?.id, moodBasedList]);

  const onSubmit = async (data) => {
    const price = parseFloat(data.price) || 0;
    const discountAmount = parseFloat(data.discount.amount) || 0;
    const discountPercentage = parseFloat(data.discount.percentage) || 0;

    if (data.discount.type === "amount" && discountAmount < 0) {
      toast.error("Discount amount cannot be negative");
      return;
    }

    if (data.discount.type === "amount" && discountAmount >= price) {
      toast.error(
        "Discount amount cannot be greater than price or equall to price"
      );
      return;
    }

    if (data.discount.type === "percentage" && discountPercentage < 0) {
      toast.error("Discount percentage cannot be negative");
      return;
    }

    if (data.discount.type === "percentage" && discountPercentage >= 100) {
      toast.error(
        "Discount percentage cannot be greater than or equal to 100%"
      );
      return;
    }

    if (data.featuredImage?.length == 0) {
      toast.error("Featured image is required");
      setFocus("featuredImage");
      return;
    }
    if (data.gallery?.length < 3) {
      toast.error("Gallery requires at least 3 images");
      setFocus("gallery");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      // Add Travel Package
      formData.append("type", data.type);
      formData.append("offbeat", data.offbeat);
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle);
      formData.append("slug", data.slug);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("discount", JSON.stringify(data.discount));
      // Package Details
      formData.append("duration", data.duration);
      formData.append("altitude", data.altitude);
      if (data?.altitudeunit && data.altitudeunit.trim() !== "") {
        formData.append("altitudeunit", data.altitudeunit);
      }
      formData.append("difficultyLevel", data.difficultyLevel || "");
      formData.append("season", data.season);
      formData.append("startLocation", data.startLocation);
      formData.append("endLocation", data.endLocation);
      formData.append("groupMembers", JSON.stringify(data.groupMembers));
      formData.append("itinerary", JSON.stringify(data.itinerary));
      formData.append("exclusions", JSON.stringify(data.exclusions));
      formData.append("inclusions", JSON.stringify(data.inclusions));
      //location
      formData.append("country", data.country);
      formData.append("state", data.state);
      formData.append("city", data.city);
      formData.append("locationAddress", data.locationAddress);
      //moodBased
      formData.append("moodOfJourney", JSON.stringify(data.moodOfJourney));
      //image
      // if (data?.featuredImage[0]) {
      //   formData.append("featuredImage", data?.featuredImage[0]?.url);
      //   formData.append(
      //     "featuredImageAlt",
      //     data.featuredImage[0].altText || ""
      //   );
      // }
      if (data?.featuredImage?.[0]?.file) {
        formData.append("featuredImage", data.featuredImage[0].file);
        formData.append("featuredAlt", data.featuredImage[0].altText);
      } else if (data?.featuredImage?.[0]?.url) {
        formData.append("featuredImageUrl", data.featuredImage[0].url);
        formData.append("featuredAlt", data.featuredImage[0].altText);
      }

      data.gallery.forEach((item, index) => {
        if (item.url) {
          formData.append("gallery", item.url);
          formData.append("gallery", item.altText || "");
        }
      });
      formData.append("isActive", data.isActive || false);
      //Faq
      formData.append("faq", JSON.stringify(data.faq));
      //meta
      formData.append("seo", JSON.stringify(data.seo) || "");
      formData.append("batches", JSON.stringify(data.batches));
      // formData.append("meta[description]", data.meta?.description || "");
      // formData.append("meta[keywords]", data.meta?.keywords || "");
      const response = await apiClient.patch(
        `/api/travel-packages/${param.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        toast.success("Travel Package Update successfully!");
        navigate("/travelpackage");
      }
    } catch (error) {
      console.error("Error creating travel package:", error?.response);
      toast.error(
        "Failed to Update travel package. Please try again: ",
        error?.response
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods} key={formKey}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Box sx={commoncss.mainbox}>
          <Box maxWidth="xl" mx="auto">
            <Grid container sx={commoncss.grid1}>
              <Grid item xs={12} md={6} sx={commoncss.leftGrid}>
                {/* Add Travel Package */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <BookIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Edit Trip Package
                    </Typography>
                    <CommonToolTip title="Edit Trip Package" />
                  </Stack>
                  <Box sx={travelPackageStyle.customBox3}>
                    <CommonDropdown
                      options={[
                        { value: "tour", label: "Tour" },
                        { value: "trek", label: "Trek" },
                      ]}
                      name="type"
                      label="Select Trip Type *"
                      required
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
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
                        label="Is this OffBeat Trip"
                        sx={{ whiteSpace: "nowrap" }}
                      />
                      <CommonToolTip title="Is this OffBeat Trip" />
                    </Box>
                  </Box>
                  <CommenTextField
                    name="title"
                    label="Package Name *"
                    required
                    focused={true}
                    size="small"
                    maxLength={70}
                  />
                  <CommenTextField
                    name="subtitle"
                    label="Banner Subtitle Name (optional)"
                    required
                    focused={true}
                    size="small"
                    maxLength={70}
                  />

                  {/* Type of Mood Of Journey */}

                  <Box sx={travelPackageStyle.customBox3}>
                    <CommonDropdown
                      name="moodOfJourney"
                      label="Select Moodbase Subcategory *"
                      options={moodBasedList}
                      // onChangeValues={handleMoodOfJourneyChange}
                      required
                    />
                    <CommonDropdown
                      name="season"
                      label="Select Season *"
                      options={seasonOptions}
                      required
                    />
                  </Box>
                  <Box sx={commoncss.editorBox}>
                    <label>Description *</label>
                    <CustomCKEditor
                      name="description"
                      required
                      minLength={30}
                      placeholder="Write Overview/Trip Details here..."
                      height="500px"
                    />
                  </Box>
                  {/* <CommenQuillEditor
                    name="description"
                    label="Description * (min 150 characters)"
                    required
                    minLength={150}
                    placeholder="Write Overview/Trip Details here..."
                  /> */}
                  <Box sx={travelPackageStyle.customBox3}>
                    <CommenTextField
                      name="price"
                      label="Price"
                      focused={true}
                      size="small"
                      required
                      type="number"
                    />
                    <CommonDropdown
                      options={[
                        { value: "percentage", label: "Discount in %" },
                        { value: "amount", label: "Discount in Amount" },
                      ]}
                      name="discount.type"
                      label="Discount Type"
                      focused={true}
                      size="small"
                    />
                    {discount.type === "amount" && (
                      <CommenTextField
                        name="discount.amount"
                        label="Discount"
                        type="number"
                        defaultValues="0"
                        size="small"
                        minvalue={0}
                        maxvalue={price}
                        rules={{
                          validate: (value, formValues) => {
                            const numValue = parseFloat(value) || 0;
                            const numPrice = parseFloat(formValues.price) || 0;

                            if (numValue < 0) {
                              return "Discount amount cannot be negative";
                            }
                            if (
                              formValues.discount.type === "amount" &&
                              numValue > numPrice
                            ) {
                              return "Discount amount cannot exceed price";
                            }
                            return true;
                          },
                        }}
                      />
                    )}
                    {discount.type === "percentage" && (
                      <CommenTextField
                        name="discount.percentage"
                        label="Discount"
                        type="number"
                        defaultValues="0"
                        size="small"
                        minvalue={0}
                        maxvalue={100}
                        rules={{
                          validate: (value, formValues) => {
                            const numValue = parseFloat(value) || 0;

                            if (numValue < 0) {
                              return "Discount percentage cannot be negative";
                            }
                            if (
                              formValues.discount.type === "percentage" &&
                              numValue >= 100
                            ) {
                              return "Percentage discount cannot be 100% or more";
                            }
                            return true;
                          },
                        }}
                      />
                    )}
                  </Box>
                </Paper>
                {/* Loaction */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <PinDropIcon color="primary" />
                    <Typography variant="h6" fontWeight="600">
                      Loaction
                    </Typography>
                    <CommonToolTip title="Add location for your trip package" />
                  </Stack>
                  <LocationSearch
                    value={watch("locationAddress") || ""}
                    onSelect={(data) => {
                      setValue("city", data.city || "");
                      setValue("state", data.state || "");
                      setValue("country", data.country || "");
                      setValue("locationAddress", data.formatted_address || "");
                    }}
                  ></LocationSearch>
                  <CommenTextField
                    name="state"
                    label="State *"
                    required
                    size="small"
                    disabled
                  />
                  <CommenTextField
                    name="city"
                    label="City*"
                    required
                    size="small"
                    disabled
                  />
                  {/* <CommenTextField
                  name="weatherLocation"
                  label="Weather Location*"
                  required
                  size="small"
                /> */}
                </Paper>
                {/* Single Image Upload */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <ImageIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Featured Image
                      {/* (Single Image) */}
                    </Typography>
                    <CommonToolTip title="Please upload single webp image of 100kb" />
                  </Stack>
                  <ImageUpload
                    name="featuredImage"
                    label="Choose Package Images"
                    // multiple
                    altText
                  // required
                  />
                </Paper>
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <PhotoLibraryIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Gallery
                      {/* (Min 3 images) */}
                    </Typography>
                    <CommonToolTip title="Minimum 3 images are required" />
                  </Stack>
                  <ImageUpload
                    name="gallery"
                    label="Choose Package Images"
                    multiple
                    altText
                  />
                </Paper>

                {/* {FAQs} */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
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
                  </Box>
                  {/* Gallery */}
                </Paper>
              </Grid>

              {/* Right side */}
              <Grid item xs={12} md={6} sx={commoncss.rightGrid}>
                {/* Package Details */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <BackpackIcon color="primary" />
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Package Details
                    </Typography>
                    <CommonToolTip title="Details of your trip package" />
                  </Stack>
                  <Box sx={commoncss.metabox1}>
                    <Box sx={commoncss.labelbox}>
                      {" "}
                      <label>Duration*</label>{" "}
                    </Box>
                    <Box sx={commoncss.tooltipbox}>
                      {" "}
                      <CommonToolTip title="You can also type 4days/5Nights here" />
                    </Box>
                    <Box sx={commoncss.fieldbox1}>
                      <CommenTextField
                        name="duration"
                        label="Duration*  ex: (4D/5N)"
                        required
                        minLength={5}
                        focused={true}
                        size="small"
                      />{" "}
                    </Box>
                  </Box>

                  {/* trek only */}
                  {methods.watch("type") == "trek" && (
                    <>
                      <Stack flexDirection="row" gap={3}>
                        <CommenTextField
                          name="altitude"
                          label="Altitude "
                          type="number"
                          // required
                          size="small"
                        />
                        <CommonDropdown
                          name="altitudeunit"
                          label="Altitude Unit "
                          options={[
                            { value: "meter", label: "meter" },
                            { value: "feet", label: "feet" },
                          ]}
                        />
                      </Stack>
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

                  <Box sx={travelPackageStyle.customBox3}>
                    <CommenTextField
                      name="groupMembers.minMembers"
                      label="Min Members"
                      size="small"
                      type="number"
                      focused={true}
                      required
                    />
                    <CommenTextField
                      name="groupMembers.maxMembers"
                      label="Max Members"
                      size="small"
                      type="number"
                      focused={true}
                      required
                    />
                  </Box>
                  <Box sx={travelPackageStyle.customBox3}>
                    <CommenTextField
                      name="startLocation"
                      label="Start Location *"
                      size="small"
                      required
                      focused={true}
                    />
                    <CommenTextField
                      name="endLocation"
                      label="End Location "
                      size="small"
                      required
                      focused={true}
                    />
                  </Box>
                </Paper>
                {/* itinerary */}

                {itineraryFields?.length > 0 && (
                  <Paper elevation={3} sx={commoncss.cardlineargradient}>
                    <Stack direction="column" mb={2}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        mb={3}
                      >
                        <FormatListBulletedAddIcon color="primary" />
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Itinerary
                        </Typography>
                        <CommonToolTip title="These things are included in the trip package" />
                      </Stack>

                      <Box sx={{ maxHeight: 470, overflowY: "auto", pr: 1 }}>
                        {itineraryFields.map((item, index) => (
                          <Box
                            key={item.id}
                            sx={travelPackageStyle.customFaqBox}
                          >
                            <Typography variant="subtitle1">
                              {`Day ${index + 1}`}
                            </Typography>

                            <CommenTextField
                              name={`itinerary.${index}.title`}
                              label="Title *"
                              size="small"
                              defaultValues=""
                              focused={true}
                              required
                            />
                            <Box sx={commoncss.editorBox}>
                              <label>Description *</label>
                              <CustomCKEditor
                                 name={`itinerary.${index}.description`}
                                required
                                minLength={30}
                                placeholder="Write itinerary details here..."
                                height="500px"
                              />
                            </Box>
{/* 
                            <CommenQuillEditor
                              name={`itinerary.${index}.description`}
                              label="Description *"
                              required
                              placeholder="Write itinerary details here..."
                            /> */}
                          </Box>
                        ))}
                      </Box>
                    </Stack>
                  </Paper>
                )}

                {/* (Inclusions) */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack sx={travelPackageStyle.customFaq}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={1}
                    >
                      <AddTaskIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Inclusions
                      </Typography>
                      <CommonToolTip title="These things are included in the trip package" />
                    </Stack>
                    <IconButton color="primary" onClick={handleAddInclusion}>
                      <AddIcon />
                    </IconButton>
                  </Stack>
                  <Box sx={{ maxHeight: 150, overflowY: "auto", pr: 1 }}>
                    {inclusions.map((inclusion, index) => (
                      <CommenTextField
                        key={index}
                        name={`inclusions[${index}]`}
                        label={`Inclusion ${index + 1}*`}
                        required
                        focused={true}
                        size="small"
                      />
                    ))}
                  </Box>
                </Paper>
                {/*  Exclusion */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack sx={travelPackageStyle.customFaq}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={1}
                    >
                      <WarningIcon color="disabled" />
                      <Typography variant="h6" fontWeight={600}>
                        Exclusions
                      </Typography>
                      <CommonToolTip title="These things are not included in the trip package" />
                    </Stack>
                    <IconButton color="primary" onClick={handleAddExclusion}>
                      <AddIcon />
                    </IconButton>
                  </Stack>
                  <Box sx={{ maxHeight: 150, overflowY: "auto", pr: 1 }}>
                    {exclusions.map((exclusion, index) => (
                      <CommenTextField
                        key={index}
                        name={`exclusions[${index}]`}
                        label={`Exclusion ${index + 1}*`}
                        required
                        size="small"
                        focused={true}
                      />
                    ))}
                  </Box>
                </Paper>

                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack sx={travelPackageStyle.customFaq}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={1}
                    >
                      <TodayIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Batch Dates
                      </Typography>
                      <CommonToolTip title="Include batch dates for your trip package" />
                    </Stack>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        appendBathches({ fromDate: "", toDate: "" })
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>

                  <Box sx={commoncss.faqBox}>
                    {batchesFields.map((item, index) => (
                      <Box key={item.id} sx={travelPackageStyle.customFaqBox}>
                        <Stack sx={travelPackageStyle.customFaq}>
                          <Typography variant="subtitle1">
                            Batch Date {index + 1}
                          </Typography>
                          {batchesFields.length > 1 && (
                            <IconButton
                              color="error"
                              onClick={() => removeBatches(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Stack>

                        <Stack direction="row" spacing={2}>
                          <CommenTextField
                            name={`batches.${index}.fromDate`}
                            label="From Date *"
                            type="date"
                            required
                            focused={true}
                          />
                          <CommenTextField
                            name={`batches.${index}.toDate`}
                            label="To Date *"
                            type="date"
                            required
                            focused={true}
                            sx={{ mt: 2 }}
                          />
                        </Stack>
                      </Box>
                    ))}
                  </Box>
                </Paper>

                {/* SEO */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
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
                          name="slug"
                          label="slug"
                          size="small"
                          disabled
                          focused={true}
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
                          name="seo.metaTitle"
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
                        <CommenTextField name="seo.keywords" label="keywords" />
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
                          name="seo.metaTitle"
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
                  </Box>
                </Paper>

                <Paper elevation={3} sx={commoncss.cardlineargradient}>
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
            </Grid>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
};

export default EditTravelPackage;
