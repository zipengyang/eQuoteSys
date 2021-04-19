import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

export const CustomizedDialog = ({
  isOpen,
  handleClose,
  title,
  subtitle,
  children,
}) => {
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={isOpen}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Grid container justify="space-between">
            <Grid item>{title}</Grid>
            <Grid item>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{subtitle}</DialogContentText>
          {children}
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
};
