import {
  Box,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
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
import { Add as AddIcon, Delete as DeleteIcon, Image as ImageIcon, } from "@mui/icons-material";
import CommonButton from "../../commen-component/CommenButton/CommenButton.js";
import { Switch, FormControlLabel } from "@mui/material";
import { apiClient } from "../../lib/api-client.js";
import { useNavigate } from "react-router-dom";
import CommonToolTip from "../../commen-component/CommonToolTip/CommonToolTip.js";
import commoncss from "../../styles/commoncss.js";
import LocationSearch from "../../commen-component/Address/autocomplete.js";
import { isAllowedKey, sanitizeSlug } from "../../utils/helperFunctions.js";
import PinDropIcon from '@mui/icons-material/PinDrop';
import BookIcon from "@mui/icons-material/Book";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import BackpackIcon from '@mui/icons-material/Backpack';
import SettingsIcon from "@mui/icons-material/Settings";
import TodayIcon from '@mui/icons-material/Today';
import WarningIcon from '@mui/icons-material/Warning';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';

const seasonOptions = [
  { value: "summer-trips", label: "Summer-trips" },
  { value: "winter-trips", label: "Winter-trips" },
  { value: "monsoon-trips", label: "Monsoon-trips" },
  { value: "autumn-trips", label: "Autumn-trips" },
];

const inclusionOptions = [
  { id: 1, title: "Meals", description: "Breakfast, lunch, dinner included" },
  { id: 2, title: "Accommodation", description: "3-star hotel stay" },
  { id: 3, title: "Transport", description: "Pick and drop facility" },
];
const exclusionOptions = [
  { id: 1, title: "Flights", description: "Airfare not included" },
  { id: 2, title: "Personal Expenses", description: "Shopping, tips etc." },
  { id: 3, title: "Insurance", description: "Travel insurance not provided" },
];
const AddTravelPackage = () => {
  const [loading, setLoading] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const methods = useForm({
    defaultValues: {
      type: "",
      offbeat: false,
      isActive: true,
      difficultyLevel: "Easy",
      altitudeunit: "meter",
      altitude: "",
      itinerary: [{ title: "", description: "" }],
      faq: [{ question: "", answer: "" }],
      batches: [{ fromDate: "", toDate: "" }],
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
  const navigate = useNavigate();
  const [moodBasedList, setMoodBasedList] = useState([]);

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
    fields: inclusionFields,
    append: appendInclusion,
    remove: removeInclusion,
  } = useFieldArray({
    control,
    name: "inclusions",
  });
  const {
    fields: batchesFields,
    append: appendBathches,
    remove: removeBatches,
  } = useFieldArray({
    control,
    name: "batches",
  });
  const {
    fields: exclusionFields,
    append: appendExclusion,
    remove: removeExclusion,
  } = useFieldArray({
    control,
    name: "exclusions",
  });

  const handleChipSelect = (chip) => {
    appendInclusion({ title: chip.title, description: chip.description });
  };
  const handleExclusionChipSelect = (chip) => {
    appendExclusion({ title: chip.title, description: chip.description });
  };
  const duration = watch("duration");
  const titleValue = watch("title");

  const discount = watch("discount");
  const discountType = watch("discountType");
  const price = watch("price");
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

      setValue("slug", slug);
    }
  }, [titleValue, setValue]);
  useEffect(() => {
    const days = parseInt(duration) || 0;

    if (days <= 0) {
      replaceItinerary([]);
      return;
    }

    const prevItinerary = watch("itinerary") || [];

    const newItinerary = Array.from({ length: days }, (_, i) => {
      return prevItinerary[i] || { title: "", description: "" };
    });

    replaceItinerary(newItinerary);
  }, [duration, replaceItinerary, watch]);

  useEffect(() => {
    const fetchMoodBased = async () => {
      try {
        const response = await apiClient.get("api/Moodbasejourney");
        const moodBased = response.data.data;
        if (Array.isArray(moodBased)) {
          const data = moodBased.map((item) => ({
            value: item,
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
  const onSubmit = async (data) => {
    // Convert to numbers for proper comparison
    const price = parseFloat(data.price) || 0;
    const discountAmount = parseFloat(data.discount.amount) || 0;
    const discountPercentage = parseFloat(data.discount.percentage) || 0;

    if (data.discount.type === "amount" && discountAmount < 0) {
      toast.error("Discount amount cannot be negative");
      return;
    }

    if (data.discount.type === "amount" && discountAmount > price) {
      toast.error("Discount amount cannot be greater than price");
      return;
    }

    if (data.discount.type === "percentage" && discountPercentage < 0) {
      toast.error("Discount percentage cannot be negative");
      return;
    }

    if (data.discount.type === "percentage" && discountPercentage >= 100) {
      toast.error("Discount percentage cannot be greater than or equal to 100%");
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
      formData.append("difficultyLevel", data.difficultyLevel || "");
      formData.append("altitudeunit", data.altitudeunit || "");
      formData.append("season", data.season);
      formData.append("startLocation", data.startLocation);
      formData.append("endLocation", data.endLocation);
      formData.append("groupMembers", JSON.stringify(data.groupMembers));
      formData.append("itinerary", JSON.stringify(data.itinerary));
      formData.append(
        "exclusions",
        JSON.stringify(data.exclusions.map((item) => item.description))
      );
      formData.append(
        "inclusions",
        JSON.stringify(data.inclusions.map((item) => item.description))
      );
      //location
      formData.append("country", data.country);
      formData.append("state", data.state);
      formData.append("city", data.city);
      formData.append("locationAddress", data.locationAddress);
      //moodBased
      formData.append("moodOfJourney", JSON.stringify(data.moodOfJourney));
      //image
      if (data.featuredImage[0]?.file) {
        formData.append("featuredImage", data.featuredImage[0].file);
        formData.append("featuredAlt", data.featuredImage[0].altText || "");
      }
      data.gallery.forEach((item, index) => {
        if (item.file) {
          formData.append("gallery", item.file);
          formData.append(
            `galleryAlt_${item?.file?.name}`,
            item.altText || "dsdsadasd"
          );
        }
      });
      formData.append("isActive", data.isActive || false);
      //Faq
      formData.append("faq", JSON.stringify(data.faq));
      //batches
      formData.append("batches", JSON.stringify(data.batches));
      //meta
      formData.append("seo", JSON.stringify(data.seo) || "");
      // formData.append("meta[description]", data.meta?.description || "");
      // formData.append("meta[keywords]", data.meta?.keywords || "");
      const response = await apiClient.post("/api/travel-packages/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response) {
        toast.success("Travel Package created successfully!");
        navigate("/travelpackage");
      }
    } catch (error) {
      console.error("Error creating travel package:", error?.response);
      toast.error(
        error?.response.data.message ||
        "Failed to create travel package. Please try again: "
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
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
                      Add Trip Package
                    </Typography>
                    <CommonToolTip title="Add Trip Package" />
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
                    size="small"
                    maxLength={70}
                  />
                  <CommenTextField
                    name="subtitle"
                    label="Banner Subtitle (optional)"
                    required
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
                      label="Select Season Subcategory *"
                      options={seasonOptions}
                      required
                    />
                  </Box>

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
                    <CommonDropdown
                      options={[
                        { value: "percentage", label: "Discount in %" },
                        { value: "amount", label: "Discount in Price" },
                      ]}
                      name="discount.type"
                      label="Discount Type"
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
                </Paper>
                {/* Single Image Upload */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <ImageIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Featured Image
                      {/* (Single Image) */}
                    </Typography>
                    <CommonToolTip title="please upload single webp image of 100kb" />
                  </Stack>

                  <ImageUpload
                    name="featuredImage"
                    label="Choose Package Images"
                    multiple
                    altText
                  />
                </Paper>

                {/* Gallery */}
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
                    <Box sx={commoncss.labelbox}> <label >Duration*</label> </Box>
                    <Box sx={commoncss.tooltipbox}> <CommonToolTip title="You can also type 4days/5Nights here" /></Box>
                    <Box sx={commoncss.fieldbox1}>
                      <CommenTextField
                        name="duration"
                        label="Duration*  ex: (4D/5N)"
                        required
                        minLength={5}
                        size="small"
                      /> </Box>
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
                      label="End Location *"
                      size="small"
                      required
                    />
                  </Box>
                </Paper>
                {/* itinerary */}

                {itineraryFields?.length > 0 && (
                  <Paper elevation={3} sx={commoncss.cardlineargradient}>
                    <Stack direction="column" mb={2}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                        <FormatListBulletedAddIcon color="primary" />
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Itinerary
                        </Typography>
                        <CommonToolTip title="These things are included in the trip package" />
                      </Stack>
                      <Box sx={{ maxHeight: 470, overflowY: "auto", pr: 1 }}>
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
                      </Box>
                    </Stack>
                  </Paper>
                )}

                {/* (Inclusions) */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack sx={travelPackageStyle.customFaq}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                      <AddTaskIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Inclusions
                      </Typography>
                      <CommonToolTip title="These things are included in the trip package" />
                    </Stack>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        appendInclusion({ title: "", description: "" })
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>
                  <Box sx={travelPackageStyle.inclusionsContainer}>
                    {inclusionFields.map((inclusion, index) => (
                      <Stack key={index} sx={travelPackageStyle.inclusionsBox}>
                        <CommenTextField
                          key={index}
                          name={`inclusions[${index}].description`}
                          label={`Inclusion ${index + 1}*`}
                          required
                          size="small"
                        />
                        {inclusionFields.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => removeInclusion(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Stack>
                    ))}
                  </Box>
                  <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                    {inclusionOptions.map((chip) => (
                      <Chip
                        key={chip.id}
                        label={chip.title}
                        clickable
                        onClick={() => handleChipSelect(chip)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Paper>

                {/*  Exclusion */}
                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack sx={travelPackageStyle.customFaq}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                      <WarningIcon color="disabled" />
                      <Typography variant="h6" fontWeight={600}>
                        Exclusions
                      </Typography>
                      <CommonToolTip title="These things are not included in the trip package" />
                    </Stack>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        appendExclusion({ title: "", description: "" })
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>

                  <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                    {exclusionOptions.map((chip) => (
                      <Chip
                        key={chip.id}
                        label={chip.title}
                        clickable
                        onClick={() => handleExclusionChipSelect(chip)}
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                  <Box sx={travelPackageStyle.inclusionsContainer}>
                    {exclusionFields.map((_, index) => (
                      <Stack key={index} sx={travelPackageStyle.inclusionsBox}>
                        <CommenTextField
                          name={`exclusions[${index}].description`}
                          label={`Exclusion ${index + 1}*`}
                          required
                          size="small"
                        />
                        {exclusionFields.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => removeExclusion(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Stack>
                    ))}
                  </Box>
                </Paper>

                <Paper elevation={3} sx={commoncss.cardlineargradient}>
                  <Stack sx={travelPackageStyle.customFaq}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={1}>
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
                          label="Slug"
                          size="small"
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
                          name="seo.metaDescription"
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
    </FormProvider >
  );
};

export default AddTravelPackage;
