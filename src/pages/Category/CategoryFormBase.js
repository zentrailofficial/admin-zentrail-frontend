import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Stack,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Controller, FormProvider, useFieldArray } from "react-hook-form";
import CommenTextField from "../../commen-component/TextField/TextField";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import CommonButton from "../../commen-component/CommenButton/CommenButton";
import BookIcon from "@mui/icons-material/Book";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ImageIcon from "@mui/icons-material/Image";
import travelPackageStyle from "../../styles/travelPackage";
import categoryStyle from "../../styles/category";
import CommenQuillEditor from "../../commen-component/TextEditor/TextEditor";
import CommonToolTip from "../../commen-component/CommonToolTip/CommonToolTip";
import commoncss from "../../styles/commoncss";
import SettingsIcon from "@mui/icons-material/Settings";
import { isAllowedKey, sanitizeSlug } from "../../utils/helperFunctions";

const CategoryFormBase = ({ methods, onSubmit, isEdit = false }) => {

  const {
    formState: { isSubmitting },
    control,
    watch,
    setValue,
  } = methods;

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: "faq",
  });
  const titleValue = !isEdit && watch("name");
  // useEffect(() => {
  //   if (titleValue) {
  //     const slug = titleValue
  //       .toLowerCase()
  //       .trim()
  //       .replace(/[^\w\s]/gi, "")
  //       .replace(/\s+/g, "-");

  //     setValue("slug", slug);
  //   }
  // }, [titleValue, setValue]);
  useEffect(() => {
    if (!isEdit && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^\w\s]/gi, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      setValue("slug", slug, { shouldValidate: true });
    }
  }, [titleValue, isEdit, setValue]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box sx={commoncss.mainbox} >
            <Box maxWidth="xl" mx="auto" >
              <Grid
                container
                sx={commoncss.grid1} >
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={commoncss.leftGrid}
                >
                  <Paper elevation={3}
                    sx={commoncss.cardlineargradient}>
                    <Stack direction="row" justifyContent={"space-between"}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <BookIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                          Add Category
                        </Typography>
                        <CommonToolTip title=" Add Category" />
                      </Stack>
                      <FormControlLabel
                        control={
                          <Controller
                            name="isblog"
                            control={methods.control}
                            render={({ field }) => (
                              <Switch {...field} checked={field.value} />
                            )}
                          />
                        }
                        label="category for blog"
                        sx={{ whiteSpace: "nowrap" }}
                      />
                    </Stack>
                    <Box sx={commoncss.customBox1}>
                      <Box sx={commoncss.customBox2}>
                        <label >Category Name  </label>
                        <CommonToolTip title="70 characters only" />
                      </Box>
                      <CommenTextField
                        name="name"
                        focused={isEdit}
                        label="Category Name"
                        required
                      />  </Box>

                    <CommenQuillEditor name="description" required minLength={30} label="Category description" />
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
                      <CommonToolTip title="Alt text required" />
                    </Stack>
                    <ImageUpload
                      name="image"
                      focused={isEdit}
                      label="Image"
                      altText
                    // defaultImage={defaultImage}
                    />
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
                        <Box sx={commoncss.labelbox}> <label>Meta Title</label></Box>
                        <Box sx={commoncss.tooltipbox}>
                          <CommonToolTip title="60 characters only" /></Box>
                        <Box sx={commoncss.fieldbox}><CommenTextField
                          name="metaTitle"
                          focused={isEdit}
                          label="Meta Title"
                          required={!watch("isblog")}
                          maxLength={60}
                        />
                        </Box>
                      </Box>
                      <Box sx={commoncss.metabox1}>
                        <Box sx={commoncss.labelbox}><label>Keywords</label></Box>
                        <Box sx={commoncss.tooltipbox}>  <CommonToolTip title="Keywords" /></Box>
                        <Box sx={commoncss.fieldbox}> <CommenTextField
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
                          <CommonToolTip title="Keywords" />
                        </Box>

                        <Box sx={commoncss.fieldbox}>
                          <CommenTextField
                            name="metaDescription"
                            focused={isEdit}
                            label="Meta Description"
                            required={!watch("isblog")}
                            multiline
                            rows={3}
                            maxLength={160}
                          />
                        </Box>
                      </Box>
                      <Box sx={commoncss.metabox1}>
                        <Box sx={commoncss.labelbox}>
                          <label>Slug</label>
                        </Box>
                        <Box sx={commoncss.tooltipbox}>
                          <CommonToolTip title="Slug" />
                        </Box>
                        <Box sx={commoncss.fieldbox}>
                          <CommenTextField
                            name="slug"
                            label="slug"
                            required={!watch("name")}
                            focused={isEdit}
                            disabled={isEdit}
                            readOnly={isEdit && true}
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
                  <CommonButton
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    fullWidth={false}
                  >
                    {isEdit ? "Update Category" : "Add Category"}
                  </CommonButton>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </form>
        {/* </Box> */}
      </FormProvider>
    </>
  );
};

export default CategoryFormBase;
