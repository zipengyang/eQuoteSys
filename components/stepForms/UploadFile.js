import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase/firebase';
import { useRouter } from 'next/router';
import ConfirmDialog from '../shared/confirmDialog';

//this is for login user and skip the contact form.
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

export default function UploadFile() {
  const classes = useStyles();
  const router = useRouter();
  const { quoteid, uid } = router.query;

  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: '',
    subTitle: '',
    entrance: '',
  });

  const { handleSubmit, register, errors } = useForm();
  const onSubmit = (data) => {
    console.log(quoteid);
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(
      `/gerberFile/${quoteid}/` + data.gerberFile[0].name,
    );
    fileRef.put(data.gerberFile[0]).then(() => {
      // update url and confirm success and redirect to self-service page.
      // update url
      fileRef.getDownloadURL().then((url) => {
        const ref = firebase.firestore().collection('specs');
        ref
          .doc(quoteid)
          .update({
            gerberFileUrl: url,
            status: 'submitted',
            submittedDate: new Date().toISOString(),
          })
          .then(() => {
            // log activity using cloud function
            const data = { quoteId: quoteid, activity: 'submit quote' };
            const logActivity = firebase
              .functions()
              .httpsCallable('logCustomerActivity');
            logActivity(data);
          })
          .catch((err) => {
            console.error(err);
          })
          .then(() => {
            setConfirmDialog({
              isOpen: true,
              title: 'Thank you for submitting your request for quote.',
              subTitle:
                'We will check the gerber file and come back to you with offical quote shortly.',
              entrance: 'thankyou',
              onConfirm: () => {
                if (uid === 'uid') {
                  window.location.href = '/';
                } else {
                  router.push(`/users/${uid}/selfService`);
                }
              },
            });
          });
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit
            </Button>
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
