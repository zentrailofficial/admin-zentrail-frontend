import React, { use, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import commoncss from "../../styles/commoncss";

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
      sx={commoncss.commonBtn}
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
