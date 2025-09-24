import React, { useEffect } from "react";
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
import ImageIcon from "@mui/icons-material/Image";
import travelPackageStyle from "../../styles/travelPackage";
import categoryStyle from "../../styles/category";
import CommenQuillEditor from "../../commen-component/TextEditor/TextEditor";

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
  
  console.log(!watch("isblog"));
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Box sx={categoryStyle.customBox}>
                <Stack direction="row" justifyContent={"space-between"}>
                  <Stack direction="row" spacing={2}>
                    <BookIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Add Category
                    </Typography>
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
                <CommenTextField
                  name="name"
                  focused={isEdit}
                  label="Category Name"
                  required
                />
                <CommenQuillEditor name="description" required minLength={30} label="Category description"/>
                <ImageUpload
                  name="image"
                  focused={isEdit}
                  label="Image"
                  altText
                  // defaultImage={defaultImage}
                />
              </Box>

              <Box sx={[categoryStyle.customBox, { marginTop: "30px" }]}>
                <Stack direction="row" spacing={2}>
                  <BookIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Add Seo Tags
                  </Typography>
                </Stack>
                <CommenTextField
                  name="metaTitle"
                  focused={isEdit}
                  label="Meta Title"
                  required={!watch("isblog")}
maxLength={60}
                />
              
                <CommenTextField
                  name="metaDescription"
                  focused={isEdit}
                  label="Meta Description"
                  required={!watch("isblog")}
                  multiline
                  rows={3}
                  maxLength={160}
                />
                <CommenTextField
                  name="metaKeyword"
                  focused={isEdit}
                  label="meta keywords"
                  required={!watch("isblog")}
                />
                  <CommenTextField
                  name="slug"
                  label="slug"
                  // required={!watch("name")}
                  focused={isEdit}
                  disabled={isEdit}
                  readOnly={isEdit && true}
                />
              </Box>
            </Grid>
            <Grid size={6}>
              <Box sx={categoryStyle.customBox}>
                <Stack sx={travelPackageStyle.customFaq}>
                  <Box sx={addBlogStyle.customBox2}>
                    <QuestionAnswerIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      FAQs
                    </Typography>
                    <CommonToolTip title="Keywords" />
                  </Box>
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

                 <CommonButton
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                fullWidth={false}
              >
                {isEdit ? "Update Category" : "Add Category"}
              </CommonButton>
              </Box>
            </Grid>
          </Grid>

        </form>
        {/* </Box> */}
      </FormProvider>
    </>
  );
};

export default CategoryFormBase;
