import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase/firebase';
import { useSpecContext } from './SpecContext';
import { useRouter } from 'next/router';
import CompletedDialog from './CompletedDialog';

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

export default function ContactForm() {
  //   const router = useRouter();
  //   const { quoteid, uid, step } = router.query;
  const classes = useStyles();
  const [Open, setOpen] = React.useState(false);
  const { handleSubmit, register, errors } = useForm();
  const { state, handleSpecChange } = useSpecContext();

  const activeStep = state.activeStep.value;

  const router = useRouter();
  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: Open,
    title: '',
    subTitle: '',
    entrance: '',
  });

  const onSubmit = async (data) => {
    // console.log(data.gerberFile);
    const email = data.email.toLowerCase();
    // console.log(email);
    const userRef = firebase.firestore().collection('users');
    const res = await userRef.doc(email).get();
    const result = () => res.data();

    if (result.length === 0) {
      // no document found, create a new one -- will use cloud function instead
      await userRef
        .doc(email)
        .set({
          firstName: data.firstName,
          lastName: data.lastName,
          companyName: data.companyName,
          email: email,
          createdDate: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          router.push('?create=true&progress=100');
          handleSpecChange('activeStep', 3);
          setOpen(true);
        })
        .then(() => {
          const QuoteReceivedEmail = firebase
            .functions()
            .httpsCallable('QuoteReceivedEmail');
          QuoteReceivedEmail(email);
        });
    } else {
      const ref = firebase.firestore().collection('specs');
      ref
        .doc(state.quoteId)
        .update({
          // gerberFileUrl: url,
          userId: email,
          status: 'submitted',
        })
        .then(() => {
          // log activity using cloud function
          const data = { quoteId: state.quoteId, activity: 'submit quote' };
          const logActivity = firebase
            .functions()
            .httpsCallable('logCustomerActivity');
          logActivity(data);
        })
        .then(() => {
          router.push('?create=true&progress=100');
          handleSpecChange('activeStep', 3);
          setOpen(true);
        })
        .then(() => {
          const QuoteReceivedEmail = firebase
            .functions()
            .httpsCallable('QuoteReceivedEmail');
          QuoteReceivedEmail(email);
        });
    }
    // upload file and update fields
    if (!!data.gerberFile) {
      // allow empty just for demo purpose.
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(
        `/gerberFile/${state.quoteId}/` + data.gerberFile[0].name,
      );
      fileRef.put(data.gerberFile[0]).then(() => {
        fileRef.getDownloadURL().then((url) => {
          const ref = firebase.firestore().collection('specs');
          ref
            .doc(state.quoteId)
            .update({
              gerberFileUrl: url,
              // userId: email,
              // status: 'submitted',
            })
            .then(() => {
              const QuoteReceivedEmail = firebase
                .functions()
                .httpsCallable('QuoteReceivedEmail');
              QuoteReceivedEmail(email);
            })
            .catch((err) => console.error(err));
          // .then(() => {
          //   // log activity using cloud function
          //   const data = { quoteId: state.quoteId, activity: 'submit quote' };
          //   const logActivity = firebase
          //     .functions()
          //     .httpsCallable('logCustomerActivity');
          //   logActivity(data);
          // })
          // .then(() => {
          //   router.push('?create=true&progress=100');
          //   handleSpecChange('activeStep', 3);
          //   setOpen(true);
          // });
        });
      });
    }
  };

  return (
    <>
      <Container component="main">
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                variant="outlined"
                required
                fullWidth
                label="First Name"
                disabled={activeStep >= 3}
                autoFocus
                {...register('firstName')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Last Name"
                disabled={activeStep >= 3}
                autoComplete="lname"
                {...register('lastName')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Company Name"
                disabled={activeStep >= 3}
                autoComplete="cName"
                {...register('companyName')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email Address"
                disabled={activeStep >= 3}
                autoComplete="email"
                {...register('email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                multiline
                rows={3}
                rowsMax={8}
                label="Note"
                disabled={activeStep >= 3}
                {...register('note')}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel htmlFor="gerberFile">Your Gerber file</InputLabel>
              <TextField
                variant="outlined"
                required
                fullWidth
                disabled={activeStep >= 3}
                name="gerberFile"
                type="file"
                {...register('gerberFile')}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                disabled={activeStep >= 3}
                variant="contained"
                color="secondary"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>

      <CompletedDialog isOpen={Open} handleClose={setOpen} />
    </>
  );
}
