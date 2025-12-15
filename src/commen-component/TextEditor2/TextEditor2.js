import { Controller, useFormContext } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import JoditEditor from "jodit-react";
import config from "./editorConfig";

const CustomCKEditor = ({ name, label, required, minLength, maxLength}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? "This field is required" : false,
        validate: (value) => {
          const text = value?.replace(/<[^>]+>/g, "")?.trim(); 
          const wordCount = text ? text.split(/\s+/).length : 0;

          if (minLength && wordCount < minLength) {
            return `Minimum ${minLength} words required`;
          }

          if (maxLength && wordCount > maxLength) {
            return `Maximum ${maxLength} words allowed`;
          }

          return true;
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
    
        <Box>
          {    console.log(value )}
          {label && (
            <Typography sx={{ mb: 1, fontWeight: 600 }}>
              {label}
            </Typography>
          )}

          <JoditEditor
            value={value || ""}
            config={config}
            onBlur={(content) => onChange(content)}
          />

          {error && (
            <Typography sx={{ color: "red", mt: 1 }}>
              {error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};

export default CustomCKEditor;