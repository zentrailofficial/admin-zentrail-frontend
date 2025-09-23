import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";

const CommenTextField = ({
  name,
  label,
  type = "text",
  required = false,
  multiline = false,
  rows = 4,
  focused,
  minLength,
  maxLength,
  messages = {},
  onChange,
  readOnly=false,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required
          ? messages.required || `${label} is required`
          : false,
        ...(minLength && {
          minLength: {
            value: minLength,
            message:
              messages.minLength ||
              `${label} must be at least ${minLength} characters`,
          },
        }),
        ...(maxLength && {
          maxLength: {
            value: maxLength,
            message:
              messages.maxLength ||
              `${label} cannot exceed ${maxLength} characters`,
          },
        }),
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          size="small"
          label={label}
          type={type}
          fullWidth
          contentEditable={false}
          variant="outlined"
          multiline={multiline}
          rows={multiline ? rows : undefined}
          error={!!error}
          helperText={error?.message}
          margin="normal"
          focused={!!focused}
          onChange={(e) => {
            const inputValue = e.target.value;
            field.onChange(e);
            if (onChange) {
              onChange(inputValue);
            }
          }}
          {...rest}
          // inputProps={{
          //   maxLength: maxLength || undefined, // prevent typing over limit
          // }}
        />
      )}
    />
  );
};

export default CommenTextField;
