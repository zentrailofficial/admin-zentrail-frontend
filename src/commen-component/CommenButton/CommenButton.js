import React, { use, useState } from "react";
import { Button, CircularProgress } from "@mui/material";

const CommonButton = ({
  children,
  type = "button",
  fullWidth = true,
  variant = "contained",
  onClick,
  sx = {},
  loading = false,
  ...rest
}) => {
  
  return (
    <Button
      type={type}
      variant={variant}
      fullWidth={fullWidth}
      onClick={onClick}
      sx={{ ...sx }}
      disabled={loading || rest.disabled}
      loading={loading}
      {...rest}
    >
    {/* {loading ? (<><CircularProgress size={20} sx={{mr:1}}/>Loading...</>) : (children)} */}
    {children}
     
    </Button>
  );
};

export default CommonButton;
