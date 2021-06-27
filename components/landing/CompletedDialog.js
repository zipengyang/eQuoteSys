import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useRouter } from 'next/router';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CompletedDialog({ isOpen, handleRouter }) {
  //   const [open, setOpen] = React.useState(false);

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  //   const handleClose = () => {
  //     setOpen(false);
  //   };
  // console.log( 'isOpen:', isOpen );
  const router = useRouter();
  const handleClick = () => {
    handleClose(false);
    router.push(url);
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {'Keep in touch soon!'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Thank you for submitting a quote. we will be working on the gerber
            file and come back to you shortly.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleRouter()} color="primary">
            ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
