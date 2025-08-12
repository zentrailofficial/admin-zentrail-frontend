import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CommonButton from "../CommenButton/CommenButton";

const ConfirmDelete = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <CommonButton
          onClick={onClose}
          color="primary"
          variant="outlined"
          fullWidth={false}
        >
          {cancelText}
        </CommonButton>
        <CommonButton
          onClick={onConfirm}
          loading={loading}
          color="error"
          fullWidth={false}
        >
          {confirmText}
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelete;
