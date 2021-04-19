import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  makeStyles,
  IconButton,
  Button,
} from '@material-ui/core';
// import Controls from './controls/Controls';
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import WarningIcon from '@material-ui/icons/Warning';

const useStyles = makeStyles((theme) => ({
  dialog: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5),
  },
  dialogTitle: {
    textAlign: 'center',
  },
  dialogContent: {
    textAlign: 'center',
  },
  dialogAction: {
    justifyContent: 'center',
  },
  titleIcon: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
      cursor: 'default',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '8rem',
    },
  },
}));

export default function ConfirmDialog(props) {
  const { confirmDialog, setConfirmDialog } = props;
  const classes = useStyles();

  return (
    <Dialog open={confirmDialog.isOpen} classes={{ paper: classes.dialog }}>
      <DialogTitle className={classes.dialogTitle}>
        <IconButton disableRipple className={classes.titleIcon}>
          {confirmDialog.entrance === 'thankyou' ? (
            <DoneAllIcon />
          ) : (
            <WarningIcon />
          )}
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="h6">{confirmDialog.title}</Typography>
        <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions className={classes.dialogAction}>
        {confirmDialog.entrance != 'thankyou' && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() =>
              setConfirmDialog({ ...confirmDialog, isOpen: false })
            }
          >
            No
          </Button>
        )}
        <Button
          variant="outlined"
          color="primary"
          onClick={confirmDialog.onConfirm}
        >
          Ok{' '}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
