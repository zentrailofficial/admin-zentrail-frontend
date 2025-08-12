import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const CommonDropdown = ({
  name,
  label,
  options = [],
  required = false,
  showAddMore = false,
  onAddMoreClick,
  ...props
}) => {
  const { control , error } = useFormContext();
  const labelId = `${name}-label`;
  const selectId = `${name}-select`;

  return (
    <FormControl fullWidth margin="normal"  size="small">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label} is required` : false,
        }}
        render={({ field, fieldState: { error } }) => (
          <Select
            {...field}
            id={selectId}
            labelId={labelId}
            label={label}
            error={!!error}
            size="small"
            {...props}
            MenuProps={{ PaperProps: { style: { maxHeight: 250 ,marginRight:0} } }}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}

            {/* {showAddMore && (
              <MenuItem
                value="__add_more__"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddMoreClick) onAddMoreClick();
                }}
              >
                ➕ Add More
              </MenuItem>
            )} */}
          </Select>
        )}
      />
      {error && (
        <Box mt={0.5} color="error.main" fontSize={13}>
          
          {error.message}
        </Box>  
      )}
    </FormControl>
  );
};

export default CommonDropdown;
