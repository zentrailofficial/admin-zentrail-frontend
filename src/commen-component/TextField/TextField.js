
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";

const CommenTextField = ({
  name,
  label,
  type = "text",
  required = false,
  multiline = false,
  rows = 4,
  focused
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? `${label} is required` : false,
        minLength: {
          value: 3,
          message: `${label} must be at least 3 characters`,
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          size="small"
          label={label}
          type={type}
          fullWidth
          variant="outlined"
          multiline={multiline}
          rows={multiline ? rows : undefined}
          error={!!error}
          helperText={error?.message}
          margin="normal"
          focused={focused?true:false}
        />
      )}
    />
  );
};

export default CommenTextField;
