import { Tooltip } from "@mui/material";
import React from "react";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
const CommonToolTip = ({ title }) => {
  return (
    
    <Tooltip title={title} arrow>
      <InfoOutlineIcon fontSize="small" />
    </Tooltip>
  );
};

export default CommonToolTip;
