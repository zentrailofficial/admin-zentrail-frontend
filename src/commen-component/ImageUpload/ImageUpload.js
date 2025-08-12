import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { Delete } from "@mui/icons-material";

const ImageUpload = ({
  name,
  label = "Upload Image",
  multiple = false,
  altText = false,
  disabled = false,
}) => {
  const { control, getValues } = useFormContext();
  const [previews, setPreviews] = useState([]);
  useEffect(() => {
    console.log(getValues(name), "getvalue", name);
    const value = getValues(name);
    if (value && value.length > 0 && previews.length === 0) {
      const initial = value.map((img) =>
        img.url
          ? { url: img.url, altText: img.altText || "" }
          : {
              file: img.file,
              preview: URL.createObjectURL(img.file),
              altText: img.altText || "",
            }
      );
      setPreviews(initial);
    }
  }, []);

  const handleImageChange = (e, onChange) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      altText: "",
    }));

    const updated = multiple ? [...previews, ...newPreviews] : newPreviews;

    setPreviews(updated);
    onChange(updated);
  };

  const handleRemove = (index, onChange) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onChange(updated);
  };

  const handleAltChange = (index, value, onChange) => {
    const updated = previews.map((item, i) =>
      i === index ? { ...item, altText: value } : item
    );
    setPreviews(updated);
    onChange(updated);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field: { onChange } }) => (
        <Box
          sx={{
            border: "2px dashed #d1d5db",
            p: 1,
            borderRadius: 2,
            textAlign: "center",
            // bgcolor: "#fff",
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            {label}
          </Typography>

          {!disabled && (
            <Button variant="outlined" component="label">
              {multiple ? "Upload Images" : "Upload Image"}
              <input
                type="file"
                hidden
                accept="image/*"
                multiple={multiple}
                onChange={(e) => handleImageChange(e, onChange)}
              />
            </Button>
          )}
          {console.log(previews, "previews")}
          <Box mt={1} sx={{ width: "100%", overflow: "auto" }}>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                overflowX: "auto",
                width: "max-content",
              }}
            >
              {previews.map((img, index) => (
                <Box
                  key={index}
                  border="1px solid #ccc"
                  borderRadius="8px"
                  p={1}
                  position="relative"
                  minWidth={150}
                  maxWidth={150}
                >
                  <img
                    src={img.preview || img.url}
                    alt={`preview-${index}`}
                    style={{
                      width: "100%",
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                  {!disabled && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemove(index, onChange)}
                      sx={{ position: "absolute", top: 4, right: 4 }}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  )}

                  {altText && (
                    <TextField
                      label="Alt Text"
                      size="small"
                      fullWidth
                      margin="dense"
                      value={img.altText}
                      onChange={(e) =>
                        handleAltChange(index, e.target.value, onChange)
                      }
                      disabled={disabled}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
          <Typography
            variant="caption"
            // color="text.secondary"
            mt={2}
          >
            PNG, JPG, GIF up to 100KB
          </Typography>
        </Box>
      )}
    />
  );
};

export default ImageUpload;
