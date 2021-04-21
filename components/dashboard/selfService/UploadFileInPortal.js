import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import { useForm } from 'react-hook-form';
import firebase from '../../../firebase/firebase';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import ConfirmDialog from '../../shared/confirmDialog';
import { useAuth } from '../../../firebase/auth';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function UploadFileInPortal({
  quoteId,
  handleClose,
  campaigns,
}) {
  const classes = useStyles();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: '',
    subTitle: '',
    entrance: '',
  });

  const { handleSubmit, register, errors } = useForm();
  const onSubmit = (data) => {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(
      `/gerberFile/${quoteId}/` + data.gerberFile[0].name,
    );
    fileRef.put(data.gerberFile[0]).then(() => {
      // update url and confirm success and redirect to self-service page.
      // update url
      fileRef.getDownloadURL().then((url) => {
        const ref = firebase.firestore().collection('specs');
        if (campaigns) {
          ref
            .doc(quoteId)
            .update({
              gerberFileUrl: url,
              status: 'submitted',
              submittedDate: new Date().toISOString(),
              'campaigns.isAccepted': true,
            })
            .then(() => {
              setConfirmDialog({
                isOpen: true,
                title: 'Thank you for submitting your request for quote.',
                subTitle:
                  'We will check the gerber file and come back to you with offical quote shortly.',
                entrance: 'thankyou',
                onConfirm: () => {
                  queryClient.invalidateQueries('specs');
                  handleClose();
                },
              });
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          ref
            .doc(quoteId)
            .update({
              gerberFileUrl: url,
              status: 'submitted',
              submittedDate: new Date().toISOString(),
            })
            .then(() => {
              setConfirmDialog({
                isOpen: true,
                title: 'Thank you for submitting your request for quote.',
                subTitle:
                  'We will check the gerber file and come back to you with offical quote shortly.',
                entrance: 'thankyou',
                onConfirm: () => {
                  queryClient.invalidateQueries('specs');
                  handleClose();
                },
              });
            })
            .catch((err) => {
              console.error(err);
            });
        }
        // log activity using cloud function
        const data = { quoteId: quoteId, activity: 'submit quote' };
        const logActivity = firebase
          .functions()
          .httpsCallable('logCustomerActivity');
        logActivity(data);
      });
    });
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <form
            className={classes.form}
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel htmlFor="gerberFile">Your Gerber file</InputLabel>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="gerberFile"
                  id="gerberFile"
                  type="file"
                  inputRef={register}
                />
              </Grid>

              <Grid item xs={6} sm={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Button
                  // type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={() => handleClose()}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
