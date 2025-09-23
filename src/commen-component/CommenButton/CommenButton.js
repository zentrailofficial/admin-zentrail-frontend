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
      sx={{
        background: " linear-gradient(180deg, #0095ffbe, #d24bff)", // gradient here
        color: "#fff",
        fontWeight: "600",
        textTransform: "none",
        "&:hover": {
          background: " linear-gradient(180deg, #5959b9be, #d24bff)", // reverse gradient on hover
        },
        ...sx,
      }}
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
